/**
 * Airthings Wave / View thresholds (metric units).
 * @see https://help.airthings.com/en/articles/6009728-wave-understanding-the-sensor-thresholds
 * @see https://www.airthings.com/what-is-particulate-matter
 */
export const AIR_QUALITY_STATUS = {
  GOOD: "good",
  MODERATE: "moderate",
  POOR: "poor",
};

export const AIR_QUALITY_STATUS_LABELS = {
  good: "God",
  moderate: "Middels",
  poor: "Dårlig",
};

export const AIR_QUALITY_STATUS_COLORS = {
  good: "#6ee7b7",
  moderate: "#fbbf24",
  poor: "#f87171",
};

/** Sensors that contribute to Airthings AirGlimpse / Wave ring (not temp, pressure, noise, light). */
export const AIRTHINGS_OVERALL_CAPABILITIES = [
  "measure_co2",
  "measure_voc",
  "measure_humidity",
  "measure_pm25",
  "measure_radon",
];

export const AIR_QUALITY_METRICS = [
  {
    capability: "measure_co2",
    label: "CO₂",
    format: (value) => Math.round(value),
    unit: "ppm",
    detailPriority: 1,
    /** Airthings: <800 good, 800–1000 fair, >1000 poor */
    status: (value) => {
      if (value < 800) return AIR_QUALITY_STATUS.GOOD;
      if (value <= 1000) return AIR_QUALITY_STATUS.MODERATE;
      return AIR_QUALITY_STATUS.POOR;
    },
    chartThresholds: [800, 1000],
  },
  {
    capability: "measure_pm25",
    label: "PM2.5",
    format: (value) => Math.round(value),
    unit: "µg/m³",
    detailPriority: 2,
    /** Airthings: <10 good, 10–<25 fair, ≥25 poor */
    status: (value) => {
      if (value < 10) return AIR_QUALITY_STATUS.GOOD;
      if (value < 25) return AIR_QUALITY_STATUS.MODERATE;
      return AIR_QUALITY_STATUS.POOR;
    },
  },
  {
    capability: "measure_voc",
    label: "VOC",
    format: (value) => Math.round(value),
    unit: "ppb",
    detailPriority: 3,
    /** Airthings: <250 good, 250–2000 fair, >2000 poor */
    status: (value) => {
      if (value < 250) return AIR_QUALITY_STATUS.GOOD;
      if (value <= 2000) return AIR_QUALITY_STATUS.MODERATE;
      return AIR_QUALITY_STATUS.POOR;
    },
  },
  {
    capability: "measure_humidity",
    label: "Luftfuktighet",
    format: (value) => Math.round(value),
    unit: "%",
    detailPriority: 4,
    /** Airthings: 30–60% good; 25–30 / 60–70 fair; else poor */
    status: (value) => {
      if (value >= 30 && value <= 60) return AIR_QUALITY_STATUS.GOOD;
      if ((value >= 25 && value < 30) || (value > 60 && value <= 70)) {
        return AIR_QUALITY_STATUS.MODERATE;
      }
      return AIR_QUALITY_STATUS.POOR;
    },
  },
  {
    capability: "measure_radon",
    label: "Radon",
    format: (value) => Math.round(value),
    unit: "Bq/m³",
    detailPriority: 5,
    /** Airthings Wave Plus: <100 good, 100–150 fair, >150 poor */
    status: (value) => {
      if (value < 100) return AIR_QUALITY_STATUS.GOOD;
      if (value <= 150) return AIR_QUALITY_STATUS.MODERATE;
      return AIR_QUALITY_STATUS.POOR;
    },
  },
];

const co2Metric = AIR_QUALITY_METRICS.find(
  (metric) => metric.capability === "measure_co2"
);

export const getCo2Status = (value) => {
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  return co2Metric.status(value);
};

export const getCo2ChartThresholds = () =>
  co2Metric.chartThresholds ?? [800, 1000];

export const getMetricsForDevice = (device) => {
  if (!device?.capabilities?.length) return [];
  return AIR_QUALITY_METRICS.filter((metric) =>
    device.capabilities.includes(metric.capability)
  );
};

export const getDetailMetrics = (device) =>
  getMetricsForDevice(device).sort(
    (a, b) => a.detailPriority - b.detailPriority
  );

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

/**
 * Airthings overall room status (AirGlimpse / Wave glow):
 * - Good: all contributing sensors in good range
 * - Middels: at least one fair, none poor
 * - Dårlig: at least one poor
 */
export const getAirthingsOverallStatus = (readings) => {
  const contributing = (readings || []).filter((reading) =>
    AIRTHINGS_OVERALL_CAPABILITIES.includes(reading.capability)
  );
  if (!contributing.length) return null;

  const statuses = contributing.map((reading) => reading.status);
  if (statuses.includes(AIR_QUALITY_STATUS.POOR)) {
    return AIR_QUALITY_STATUS.POOR;
  }
  if (statuses.includes(AIR_QUALITY_STATUS.MODERATE)) {
    return AIR_QUALITY_STATUS.MODERATE;
  }
  return AIR_QUALITY_STATUS.GOOD;
};
