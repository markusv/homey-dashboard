import { useCapabilityInsights } from "./useCapabilityInsights";

/**
 * Fetch Homey Insights temperature for a device.
 * @deprecated Prefer useCapabilityInsights — kept for existing imports.
 */
export const useTemperatureInsights = (deviceId, range = "day") =>
  useCapabilityInsights(deviceId, "measure_temperature", range);
