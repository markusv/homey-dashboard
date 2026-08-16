const BLIND_CLASSES = new Set([
  "blinds",
  "curtain",
  "sunshade",
  "shutter",
  "windowcoverings",
]);

/**
 * Homey source of truth: device class or windowcoverings_set capability.
 */
export const isBlindDevice = (device) => {
  if (!device) return false;
  if (BLIND_CLASSES.has(device.class)) return true;
  if (BLIND_CLASSES.has(device.virtualClass)) return true;

  const caps = device.capabilities || Object.keys(device.capabilitiesObj || {});
  return caps.includes("windowcoverings_set");
};
