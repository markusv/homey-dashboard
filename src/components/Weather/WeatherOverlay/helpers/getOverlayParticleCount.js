import {
  AREA_SCALE_CAP,
  MAX_RAIN_PARTICLES,
  MAX_SNOW_PARTICLES,
  STUE_AREA,
  WEATHER_OVERLAY_KIND,
} from "../WeatherOverlay.constants";

export const getOverlayParticleCount = (kind, intensity, width, height) => {
  if (!kind || kind === WEATHER_OVERLAY_KIND.NONE || intensity <= 0) {
    return 0;
  }
  const areaScale = Math.min((width * height) / STUE_AREA, AREA_SCALE_CAP);
  const isSnow = kind === WEATHER_OVERLAY_KIND.SNOW;
  const minCount = isSnow ? 18 : 22;
  const maxCount = isSnow ? 200 : 175;
  const cap = isSnow ? MAX_SNOW_PARTICLES : MAX_RAIN_PARTICLES;
  const eased = intensity ** 2.15;
  const count = Math.round(
    (minCount + (maxCount - minCount) * eased) * areaScale
  );
  return Math.min(cap, Math.max(minCount, count));
};
