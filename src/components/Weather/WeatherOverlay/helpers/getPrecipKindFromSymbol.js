import { WEATHER_OVERLAY_KIND } from "../WeatherOverlay.constants";

export const getPrecipKindFromSymbol = (symbolBase) => {
  if (!symbolBase) {
    return null;
  }
  if (symbolBase.includes("sleet")) {
    return WEATHER_OVERLAY_KIND.SLEET;
  }
  if (symbolBase.includes("snow")) {
    return WEATHER_OVERLAY_KIND.SNOW;
  }
  if (symbolBase.includes("rain")) {
    return WEATHER_OVERLAY_KIND.RAIN;
  }
  return null;
};

export const getSymbolIntensityFloor = (symbolBase) => {
  if (!getPrecipKindFromSymbol(symbolBase)) {
    return 0;
  }
  if (symbolBase.startsWith("heavy")) {
    return 0.88;
  }
  if (symbolBase.startsWith("light")) {
    return 0.4;
  }
  return 0.62;
};
