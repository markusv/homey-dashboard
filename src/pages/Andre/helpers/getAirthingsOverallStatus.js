import {
  AIR_QUALITY_STATUS,
  AIRTHINGS_OVERALL_CAPABILITIES,
} from "./airQuality.constants";

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
