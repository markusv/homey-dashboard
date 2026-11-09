import { describe, expect, it } from "vitest";
import {
  OFFLINE_BRIEFING_TEXT,
  homeOsBriefingUrl,
  readHomeOsBriefing,
} from "./readHomeOsBriefing";

describe("homeOsBriefingUrl", () => {
  it("builds the HomeOS briefing path", () => {
    expect(homeOsBriefingUrl("https://homeos.local:3000", "evening").href).toBe(
      "https://homeos.local:3000/api/briefings/evening"
    );
  });

  it("treats a host and port as https", () => {
    expect(homeOsBriefingUrl("192.168.68.91:3000", "next-week").href).toBe(
      "https://192.168.68.91:3000/api/briefings/next-week"
    );
  });
});

describe("readHomeOsBriefing", () => {
  it("returns the briefing text", async () => {
    const result = await readHomeOsBriefing({
      kind: "next-week",
      homeOsUrl: "https://homeos.local:3000",
      fetchImpl: async () => ({
        status: 200,
        text: async () =>
          JSON.stringify({ text: "Neste uke har Adrian turdag." }),
      }),
    });

    expect(result).toEqual({
      status: 200,
      text: "Neste uke har Adrian turdag.",
    });
  });

  it("uses the offline sentence when HomeOS has no text", async () => {
    const result = await readHomeOsBriefing({
      kind: "evening",
      homeOsUrl: "https://homeos.local:3000",
      fetchImpl: async () => ({
        status: 502,
        text: async () => "nope",
      }),
    });

    expect(result).toEqual({
      status: 502,
      text: OFFLINE_BRIEFING_TEXT,
    });
  });

  it("rejects an unknown kind", async () => {
    const result = await readHomeOsBriefing({
      kind: "morning",
      homeOsUrl: "https://homeos.local:3000",
      fetchImpl: async () => {
        throw new Error("should not fetch");
      },
    });

    expect(result).toEqual({ status: 404, text: null });
  });
});
