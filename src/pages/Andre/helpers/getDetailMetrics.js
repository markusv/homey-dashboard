import { getMetricsForDevice } from "./getMetricsForDevice";

export const getDetailMetrics = (device) =>
  getMetricsForDevice(device).sort(
    (a, b) => a.detailPriority - b.detailPriority
  );
