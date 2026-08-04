/** Room slug → Homey device used for temperature insights. */
const ROOM_TEMPERATURE_DEVICES = {
  loft: {
    deviceId: "95677a74-cdf4-451a-8a18-a2fe7ac8351d",
    capabilityId: "measure_temperature",
  },
};

const getRoomTemperatureConfig = (room) =>
  ROOM_TEMPERATURE_DEVICES[String(room || "").toLowerCase()] || null;

module.exports = { ROOM_TEMPERATURE_DEVICES, getRoomTemperatureConfig };
