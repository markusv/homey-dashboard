export const WEATHER_OVERLAY_KIND = {
  NONE: "none",
  RAIN: "rain",
  SNOW: "snow",
  SLEET: "sleet",
};

/** mm/h that maps to the densest kiosk-safe particle field. */
export const PRECIP_MM_FOR_MAX_INTENSITY = 4;

export const IDLE_FADE_MS = 10000;

export const MAX_RAIN_PARTICLES = 320;
export const MAX_SNOW_PARTICLES = 320;
/** Area used when tuning min/max particle counts; live size comes from the viewport. */
export const DENSITY_REFERENCE_AREA = 800 * 480;
export const AREA_SCALE_CAP = 1.6;
/** Max overlay backing-store pixels (live canvas size still comes from the viewport). */
export const OVERLAY_PIXEL_BUDGET = 600_000;
export const OVERLAY_FPS = 30;
export const OVERLAY_FRAME_MS = 1000 / OVERLAY_FPS;
export const MAX_DT_SECONDS = 0.05;
