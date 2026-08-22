import { getHomey } from "../homeyClient.js";
import { getRoomTemperatureConfig } from "../rooms.js";
import { bucketHourlyPoints } from "../insights.js";

const RANGE_CONFIG = {
  day: { resolution: "last24Hours", hours: 24 },
  week: { resolution: "last7Days", hours: 168 },
  month: { resolution: "last31Days", hours: 124 },
};

const TEMPERATURE_FALLBACK_CAPABILITIES = [
  "measure_temperature",
  "measure_temperature.outdoorTemperature",
];

const mapInsightPoints = (values, range) => {
  if (!Array.isArray(values) || values.length === 0) return [];

  if (range === "day") {
    return bucketHourlyPoints(values, 24);
  }

  return values
    .filter((entry) => entry && typeof entry.v === "number")
    .map((entry) => Math.round(entry.v * 10) / 10);
};

const roundCurrent = (value, capabilityId) => {
  if (typeof value !== "number") return null;
  if (capabilityId === "measure_co2") return Math.round(value);
  return Math.round(value * 10) / 10;
};

const readLiveCapabilityValue = (device, capabilityId) => {
  const direct = device?.capabilitiesObj?.[capabilityId]?.value;
  if (typeof direct === "number") return direct;

  if (capabilityId !== "measure_temperature") return null;

  for (const fallbackId of TEMPERATURE_FALLBACK_CAPABILITIES) {
    const value = device?.capabilitiesObj?.[fallbackId]?.value;
    if (typeof value === "number") return value;
  }

  return null;
};

export const readCapabilityInsights = async (
  deviceId,
  capabilityId,
  range = "day"
) => {
  const rangeKey = RANGE_CONFIG[range] ? range : "day";
  const { resolution } = RANGE_CONFIG[rangeKey];
  const logId = `homey:device:${deviceId}:${capabilityId}`;

  const homey = await getHomey();
  const [entries, device] = await Promise.all([
    homey.insights.getLogEntries({
      id: logId,
      resolution,
    }),
    homey.devices.getDevice({ id: deviceId }).catch(() => null),
  ]);

  const capabilityMeta = device?.capabilitiesObj?.[capabilityId];
  const capabilityValue = readLiveCapabilityValue(device, capabilityId);
  const lastInsightValue =
    typeof entries?.lastValue === "number"
      ? entries.lastValue
      : entries?.lastValue?.v;
  const current = capabilityValue ?? lastInsightValue ?? null;
  const points = mapInsightPoints(entries?.values || [], rangeKey);

  return {
    deviceId,
    capabilityId,
    unit: capabilityMeta?.units ?? null,
    range: rangeKey,
    current: roundCurrent(current, capabilityId),
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
    const payload = await readCapabilityInsights(
      config.deviceId,
      "measure_temperature",
      range
    );
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
    const payload = await readCapabilityInsights(
      deviceId,
      "measure_temperature",
      range
    );
    res.json(payload);
  } catch (error) {
    console.error(`[temperature] device ${deviceId}:`, error);
    res.status(502).json({
      error: "homey_insights_failed",
      message: error.message || String(error),
    });
  }
};

export const getDeviceInsights = async (req, res) => {
  const deviceId = String(req.params.deviceId || "").trim();
  const capabilityId = String(req.query.capability || "").trim();

  if (!deviceId || !capabilityId) {
    res.status(400).json({
      error: "missing_params",
      message: "deviceId and capability query param are required",
    });
    return;
  }

  try {
    const range = String(req.query.range || "day").toLowerCase();
    const payload = await readCapabilityInsights(deviceId, capabilityId, range);
    res.json(payload);
  } catch (error) {
    console.error(`[insights] device ${deviceId} ${capabilityId}:`, error);
    res.status(502).json({
      error: "homey_insights_failed",
      message: error.message || String(error),
    });
  }
};

export const registerTemperatureRoutes = (app) => {
  app.get("/api/read/insights/device/:deviceId", getDeviceInsights);
  app.get("/api/read/temperature/device/:deviceId", getDeviceTemperature);
  app.get("/api/read/temperature/:room", getRoomTemperature);
};
