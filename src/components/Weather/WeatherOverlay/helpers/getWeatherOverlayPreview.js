import { WEATHER_OVERLAY_KIND } from "../WeatherOverlay.constants";

const PREVIEW_STATES = {
  lightrain: {
    kind: WEATHER_OVERLAY_KIND.RAIN,
    intensity: 0.44,
    precipitationMm: 0.2,
    showSun: false,
    sunIntensity: 0,
    symbol: "lightrain",
  },
  rain: {
    kind: WEATHER_OVERLAY_KIND.RAIN,
    intensity: 0.58,
    precipitationMm: 1.2,
    showSun: false,
    sunIntensity: 0,
    symbol: "rain",
  },
  heavyrain: {
    kind: WEATHER_OVERLAY_KIND.RAIN,
    intensity: 1,
    precipitationMm: 5,
    showSun: false,
    sunIntensity: 0,
    symbol: "heavyrain",
  },
  snow: {
    kind: WEATHER_OVERLAY_KIND.SNOW,
    intensity: 0.55,
    precipitationMm: 0.8,
    showSun: false,
    sunIntensity: 0,
    symbol: "snow",
  },
  heavysnow: {
    kind: WEATHER_OVERLAY_KIND.SNOW,
    intensity: 1,
    precipitationMm: 4,
    showSun: false,
    sunIntensity: 0,
    symbol: "heavysnow",
  },
  sun: {
    kind: WEATHER_OVERLAY_KIND.NONE,
    intensity: 0,
    precipitationMm: 0,
    showSun: true,
    sunIntensity: 1,
    symbol: "clearsky_day",
  },
};

export const getWeatherOverlayPreview = (search = "") => {
  const key = new URLSearchParams(search).get("overlay");
  return PREVIEW_STATES[key] ?? null;
};
