import { getHomey } from "../homeyClient.js";
import { getRoomTemperatureConfig } from "../rooms.js";
import { bucketHourlyPoints } from "../insights.js";

const RANGE_CONFIG = {
  day: { resolution: "last24Hours", hours: 24 },
  week: { resolution: "last7Days", hours: 168 },
  month: { resolution: "last31Days", hours: 124 },
};

const mapInsightPoints = (values, range) => {
  if (!Array.isArray(values) || values.length === 0) return [];

  if (range === "day") {
    return bucketHourlyPoints(values, 24);
  }

  // Homey already returns coarse buckets for week/month — keep chronological values
  return values
    .filter((entry) => entry && typeof entry.v === "number")
    .map((entry) => Math.round(entry.v * 10) / 10);
};

const readTemperatureForDevice = async (deviceId, range = "day") => {
  const rangeKey = RANGE_CONFIG[range] ? range : "day";
  const { resolution } = RANGE_CONFIG[rangeKey];
  const capabilityId = "measure_temperature";
  const logId = `homey:device:${deviceId}:${capabilityId}`;

  const homey = await getHomey();
  const [entries, device] = await Promise.all([
    homey.insights.getLogEntries({
      id: logId,
      resolution,
    }),
    homey.devices.getDevice({ id: deviceId }).catch(() => null),
  ]);

  const capabilityValue =
    device?.capabilitiesObj?.[capabilityId]?.value ??
    device?.capabilitiesObj?.["measure_temperature.outdoorTemperature"]?.value;
  const lastInsightValue =
    typeof entries?.lastValue === "number"
      ? entries.lastValue
      : entries?.lastValue?.v;
  const current = capabilityValue ?? lastInsightValue ?? null;
  const points = mapInsightPoints(entries?.values || [], rangeKey);

  return {
    deviceId,
    unit: "°C",
    range: rangeKey,
    current: typeof current === "number" ? Math.round(current * 10) / 10 : null,
    points,
    count: points.length,
  };
};

export const getRoomTemperature = async (req, res) => {
  const room = String(req.params.room || "").toLowerCase();
  const config = getRoomTemperatureConfig(room);

  if (!config) {
    res.status(404).json({
      error: "unknown_room",
      message: `No temperature mapping for room "${room}"`,
      rooms: ["loft"],
    });
    return;
  }

  try {
    const range = String(req.query.range || "day").toLowerCase();
    const payload = await readTemperatureForDevice(config.deviceId, range);
    res.json({
      room,
      ...payload,
      deviceId: config.deviceId,
    });
  } catch (error) {
    console.error(`[temperature] ${room}:`, error);
    res.status(502).json({
      error: "homey_insights_failed",
      message: error.message || String(error),
    });
  }
};

export const getDeviceTemperature = async (req, res) => {
  const deviceId = String(req.params.deviceId || "").trim();
  if (!deviceId) {
    res.status(400).json({
      error: "missing_device",
      message: "deviceId is required",
    });
    return;
  }

  try {
    const range = String(req.query.range || "day").toLowerCase();
    const payload = await readTemperatureForDevice(deviceId, range);
    res.json(payload);
  } catch (error) {
    console.error(`[temperature] device ${deviceId}:`, error);
    res.status(502).json({
      error: "homey_insights_failed",
      message: error.message || String(error),
    });
  }
};

export const registerTemperatureRoutes = (app) => {
  app.get("/api/read/temperature/device/:deviceId", getDeviceTemperature);
  app.get("/api/read/temperature/:room", getRoomTemperature);
};
