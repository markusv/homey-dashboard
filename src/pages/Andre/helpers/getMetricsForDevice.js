import { AIR_QUALITY_METRICS } from "./airQuality.constants";

export const getMetricsForDevice = (device) => {
  if (!device?.capabilities?.length) return [];
  return AIR_QUALITY_METRICS.filter((metric) =>
    device.capabilities.includes(metric.capability)
  );
};
