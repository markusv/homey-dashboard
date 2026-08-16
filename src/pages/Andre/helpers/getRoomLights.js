import { isLightDevice } from "./isLightDevice";

export const getRoomLights = (devices, room) => {
  if (!devices || !room?.homeyZoneId) return [];

  const excluded = new Set(room.excludedLightDeviceIds || []);
  const list = Array.isArray(devices) ? devices : Object.values(devices);

  return list.filter((device) => {
    if (!device || excluded.has(device.id)) return false;
    if (device.zone !== room.homeyZoneId) return false;
    return isLightDevice(device);
  });
};

export const lightsSupportCapability = (lights, capabilityId) =>
  lights.some((light) => light?.capabilities?.includes(capabilityId));

export const lightsWithCapability = (lights, capabilityId) =>
  lights.filter((light) => light?.capabilities?.includes(capabilityId));

export const areLightsOn = (lights) => {
  const onoffLights = lightsWithCapability(lights, "onoff");
  if (onoffLights.length === 0) return false;
  return onoffLights.some(
    (light) => light?.capabilitiesObj?.onoff?.value === true
  );
};

export const getAverageDim = (lights) => {
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
