import { AIR_QUALITY_METRICS } from "./airQuality.constants";

const co2Metric = AIR_QUALITY_METRICS.find(
  (metric) => metric.capability === "measure_co2"
);

export const getCo2ChartThresholds = () =>
  co2Metric.chartThresholds ?? [800, 1000];
