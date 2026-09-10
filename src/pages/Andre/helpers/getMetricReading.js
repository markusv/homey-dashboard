export const getMetricReading = (metric, device, liveValues = {}) => {
  const value =
    liveValues[metric.capability] ??
    device?.capabilitiesObj?.[metric.capability]?.value;

  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }

  return {
    ...metric,
    value,
    display: metric.format(value),
    status: metric.status(value),
  };
};
