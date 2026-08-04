const { getHomey } = require("../homeyClient");
const { getRoomTemperatureConfig } = require("../rooms");
const { bucketHourlyPoints } = require("../insights");

const getRoomTemperature = async (req, res) => {
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
    const homey = await getHomey();
    const logId = `homey:device:${config.deviceId}:${config.capabilityId}`;

    const [entries, device] = await Promise.all([
      homey.insights.getLogEntries({
        id: logId,
        resolution: "last24Hours",
      }),
      homey.devices.getDevice({ id: config.deviceId }),
    ]);

    const capabilityValue =
      device?.capabilitiesObj?.[config.capabilityId]?.value;
    const lastInsightValue =
      typeof entries?.lastValue === "number"
        ? entries.lastValue
        : entries?.lastValue?.v;
    const current = capabilityValue ?? lastInsightValue ?? null;

    const points = bucketHourlyPoints(entries?.values || [], 24);

    res.json({
      room,
      unit: "°C",
      current,
      points,
      count: points.length,
    });
  } catch (error) {
    console.error(`[temperature] ${room}:`, error);
    res.status(502).json({
      error: "homey_insights_failed",
      message: error.message || String(error),
    });
  }
};

const registerTemperatureRoutes = (app) => {
  app.get("/api/read/temperature/:room", getRoomTemperature);
};

module.exports = { registerTemperatureRoutes, getRoomTemperature };
