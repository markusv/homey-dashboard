import https from "node:https";
import { isBriefingKind } from "../helpers/briefingKind.js";

export const OFFLINE_BRIEFING_TEXT = "Får ikke kontakt med HomeOS.";

const BRIEFING_TIMEOUT_MS = 90_000;

export const homeOsBriefingUrl = (homeOsUrl, kind) => {
  const trimmed = homeOsUrl.trim().replace(/\/$/, "");
  const withScheme = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  return new URL(`/api/briefings/${kind}`, `${withScheme}/`);
};

const responseFromBody = (status, raw) => {
  let body = null;
  try {
    body = JSON.parse(raw);
  } catch {
    body = null;
  }
  const text = body?.text;
  if (typeof text === "string" && text.trim() !== "") {
    return { status, text };
  }
  return { status: status >= 400 ? status : 502, text: OFFLINE_BRIEFING_TEXT };
};

// HomeOS on the LAN uses a private certificate.
const fetchHttps = (url, timeoutMs) =>
  new Promise((resolve, reject) => {
    const request = https.request(
      url,
      { method: "GET", rejectUnauthorized: false, timeout: timeoutMs },
      (response) => {
        const chunks = [];
        response.on("data", (chunk) => {
          chunks.push(chunk);
        });
        response.on("end", () => {
          const status = response.statusCode ?? 502;
          resolve(
            responseFromBody(status, Buffer.concat(chunks).toString("utf8"))
          );
        });
      }
    );
    request.on("timeout", () => {
      request.destroy(new Error("HomeOS briefing timed out"));
    });
    request.on("error", reject);
    request.end();
  });

export const readHomeOsBriefing = async ({
  kind,
  homeOsUrl,
  fetchImpl,
  timeoutMs = BRIEFING_TIMEOUT_MS,
}) => {
  if (!isBriefingKind(kind)) {
    return { status: 404, text: null };
  }

  const url = homeOsBriefingUrl(homeOsUrl, kind);
  if (fetchImpl) {
    const response = await fetchImpl(url, {
      signal: AbortSignal.timeout(timeoutMs),
    });
    const raw = await response.text();
    return responseFromBody(response.status, raw);
  }

  if (url.protocol === "https:") {
    return fetchHttps(url, timeoutMs);
  }

  const response = await fetch(url, {
    signal: AbortSignal.timeout(timeoutMs),
  });
  const raw = await response.text();
  return responseFromBody(response.status, raw);
};
