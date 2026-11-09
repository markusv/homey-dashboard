import {
  OFFLINE_BRIEFING_TEXT,
  readHomeOsBriefing,
} from "../readHomeOsBriefing.js";

const homeOsUrl = () => process.env.HOMEOS_URL || "https://127.0.0.1:3000";

export const getBriefing = async (req, res) => {
  const kind = String(req.params.kind || "");
  try {
    const result = await readHomeOsBriefing({
      kind,
      homeOsUrl: homeOsUrl(),
    });
    res.set("cache-control", "no-store");
    res.status(result.status).json({ text: result.text });
  } catch (error) {
    console.error("[briefing]", error);
    res.set("cache-control", "no-store");
    res.status(502).json({ text: OFFLINE_BRIEFING_TEXT });
  }
};

export const registerBriefingRoutes = (app) => {
  app.get("/api/read/briefing/:kind", getBriefing);
};
