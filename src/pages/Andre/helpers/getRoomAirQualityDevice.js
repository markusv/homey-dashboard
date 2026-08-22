import { getMetricsForDevice } from "./airQualityMetrics";

export const deviceHasAirQuality = (device) =>
  getMetricsForDevice(device).length > 0;

const getDeviceList = (devices) =>
  Array.isArray(devices) ? devices : Object.values(devices || {});

const findDeviceById = (devices, deviceId) => {
  if (!deviceId) return null;
  const list = getDeviceList(devices);
  return list.find((device) => device?.id === deviceId) || null;
};

/**
 * Resolve the air-quality source for a room:
 * 1. explicit airQualityDeviceId
 * 2. temperatureDeviceId when it exposes air-quality capabilities
 * 3. first other device in the room zone (stable name order)
 */
export const getRoomAirQualityDevice = (devices, room) => {
  if (!room) return null;

  const explicit = findDeviceById(devices, room.airQualityDeviceId);
  if (explicit && deviceHasAirQuality(explicit)) return explicit;

  const tempDevice = findDeviceById(devices, room.temperatureDeviceId);
  if (tempDevice && deviceHasAirQuality(tempDevice)) return tempDevice;

  if (!room.homeyZoneId) return null;

  const zoneDevices = getDeviceList(devices)
    .filter(
      (device) =>
        device?.zone === room.homeyZoneId &&
        device?.id !== room.temperatureDeviceId &&
        deviceHasAirQuality(device)
    )
    .sort((a, b) =>
      String(a?.name || "").localeCompare(String(b?.name || ""), "nb")
    );

  return zoneDevices[0] || null;
};

export const getRoomAirQualityDeviceId = (devices, room) =>
  getRoomAirQualityDevice(devices, room)?.id ?? null;
