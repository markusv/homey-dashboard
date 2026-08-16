import { isBlindDevice } from "./isBlindDevice";

export const WINDOWCOVERINGS_SET = "windowcoverings_set";

/** Homey: 0 = closed (ned), 1 = open (opp) for typical roller blinds. */
export const BLINDS_UP = 1;
export const BLINDS_DOWN = 0;

export const getRoomBlinds = (devices, room) => {
  if (!devices || !room?.homeyZoneId) return [];

  const excluded = new Set(room.excludedBlindDeviceIds || []);
  const list = Array.isArray(devices) ? devices : Object.values(devices);

  return list.filter((device) => {
    if (!device || excluded.has(device.id)) return false;
    if (device.zone !== room.homeyZoneId) return false;
    return isBlindDevice(device);
  });
};

export const blindsWithSet = (blinds) =>
  blinds.filter((device) =>
    device?.capabilities?.includes(WINDOWCOVERINGS_SET)
  );

const POSITION_EPS = 0.05;

const blindPositions = (blinds) =>
  blindsWithSet(blinds)
    .map((device) => device?.capabilitiesObj?.[WINDOWCOVERINGS_SET]?.value)
    .filter((value) => typeof value === "number");

/** True when every blind in the room is fully raised (open). */
export const areBlindsUp = (blinds) => {
  const positions = blindPositions(blinds);
  if (!positions.length) return false;
  return positions.every((value) => value >= 1 - POSITION_EPS);
};

/** True when at least one blind is not fully raised. */
export const areBlindsDown = (blinds) => {
  const positions = blindPositions(blinds);
  if (!positions.length) return false;
  return positions.some((value) => value < 1 - POSITION_EPS);
};
