const LIGHT_CLASSES = new Set(["light"]);
const LIGHT_VIRTUAL_CLASSES = new Set(["light"]);

const LIGHT_CAPABILITIES = [
  "onoff",
  "dim",
  "light_hue",
  "light_saturation",
  "light_temperature",
  "light_mode",
];

/**
 * Homey source of truth: class / virtualClass / light-related capabilities.
 */
export const isLightDevice = (device) => {
  if (!device) return false;
  if (LIGHT_CLASSES.has(device.class)) return true;
  if (LIGHT_VIRTUAL_CLASSES.has(device.virtualClass)) return true;

  const caps = device.capabilities || Object.keys(device.capabilitiesObj || {});
  const hasLightCap = LIGHT_CAPABILITIES.some((cap) => caps.includes(cap));
  if (!hasLightCap) return false;

  // Socket with dim + light_* is often a smart bulb adapter / fixture
  if (device.class === "socket") {
    return (
      caps.includes("dim") ||
      caps.includes("light_hue") ||
      caps.includes("light_temperature")
    );
  }

  return false;
};
