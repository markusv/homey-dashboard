import { isLightDevice } from "./isLightDevice";
import { getRoomZoneIds } from "./getRoomZoneIds";

export const getRoomLights = (devices, room, zones) => {
  if (!devices || !room?.homeyZoneId) return [];

  const excluded = new Set(room.excludedLightDeviceIds || []);
  const zoneIds = getRoomZoneIds(room, zones);
  const list = Array.isArray(devices) ? devices : Object.values(devices);

  return list.filter((device) => {
    if (!device || excluded.has(device.id)) return false;
    if (!zoneIds.has(device.zone)) return false;
    return isLightDevice(device);
  });
};

export const lightsSupportCapability = (lights, capabilityId) =>
  lights.some((light) => light?.capabilities?.includes(capabilityId));

export const lightsWithCapability = (lights, capabilityId) =>
  lights.filter((light) => light?.capabilities?.includes(capabilityId));

/** Preferred light for room status (on/off + dim). */
export const getPrimaryLight = (lights, room) => {
  if (!room?.primaryLightDeviceId || !lights?.length) return null;
  return lights.find((light) => light.id === room.primaryLightDeviceId) || null;
};

export const areLightsOn = (lights, room) => {
  const primary = getPrimaryLight(lights, room);
  if (primary) {
    if (primary.available === false) return false;
    return primary?.capabilitiesObj?.onoff?.value === true;
  }

  const onoffLights = lightsWithCapability(lights, "onoff").filter(
    (light) => light?.available !== false
  );
  if (onoffLights.length === 0) return false;
  return onoffLights.some(
    (light) => light?.capabilitiesObj?.onoff?.value === true
  );
};

export const getAverageDim = (lights, room) => {
  const primary = getPrimaryLight(lights, room);
  if (primary) {
    const value = primary?.capabilitiesObj?.dim?.value;
    return typeof value === "number" ? value : 1;
  }

  const dimLights = lightsWithCapability(lights, "dim").filter(
    (light) => typeof light?.capabilitiesObj?.dim?.value === "number"
  );
  if (dimLights.length === 0) return 1;
  const sum = dimLights.reduce(
    (acc, light) => acc + (light.capabilitiesObj.dim.value || 0),
    0
  );
  return sum / dimLights.length;
};
