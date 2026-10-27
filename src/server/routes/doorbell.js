import {
  captureDoorbellSnapshot,
  readDoorbellSnapshot,
} from "../doorbell/captureDoorbellSnapshot.js";
import { ensureDoorbellCaptureFlow } from "../doorbell/ensureDoorbellCaptureFlow.js";

const captureStatus = (error) => (error.code === "no_snapshot" ? 404 : 502);

export const captureDoorbell = async (_req, res) => {
  try {
    const snapshot = await captureDoorbellSnapshot();
    res.json(snapshot);
  } catch (error) {
    console.error("[doorbell]", error);
    res.status(captureStatus(error)).json({
      error: error.code || "capture_failed",
      message: error.message || String(error),
    });
  }
};

export const getDoorbellSnapshot = async (_req, res) => {
  try {
    const snapshot = await readDoorbellSnapshot();
    if (!snapshot) {
      res.status(404).json({ error: "no_snapshot" });
      return;
    }

    res.set("Cache-Control", "no-cache");
    res.type("image/jpeg");
    res.sendFile(snapshot.path);
  } catch (error) {
    console.error("[doorbell]", error);
    res.status(500).json({
      error: "snapshot_read_failed",
      message: error.message || String(error),
    });
  }
};

export const registerDoorbellRoutes = (app) => {
  app.post("/api/read/doorbell/capture", captureDoorbell);
  app.get("/api/read/doorbell", getDoorbellSnapshot);

  ensureDoorbellCaptureFlow()
    .then((flowId) => {
      console.log(`[doorbell] capture flow ready (${flowId})`);
    })
    .catch((error) => {
      console.warn(
        "[doorbell] capture flow setup failed:",
        error.message || error
      );
    });
};
