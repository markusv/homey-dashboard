/** Room slug → Homey device used for temperature insights. */
export const ROOM_TEMPERATURE_DEVICES = {
  loft: {
    deviceId: "95677a74-cdf4-451a-8a18-a2fe7ac8351d",
    capabilityId: "measure_temperature",
  },
};

export const getRoomTemperatureConfig = (room) =>
  ROOM_TEMPERATURE_DEVICES[String(room || "").toLowerCase()] || null;
