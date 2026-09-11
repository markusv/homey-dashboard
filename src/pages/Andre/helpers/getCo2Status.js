import { AIR_QUALITY_METRICS } from "./airQuality.constants";

const co2Metric = AIR_QUALITY_METRICS.find(
  (metric) => metric.capability === "measure_co2"
);

export const getCo2Status = (value) => {
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  return co2Metric.status(value);
};
