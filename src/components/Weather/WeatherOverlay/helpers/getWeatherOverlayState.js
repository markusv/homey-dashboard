import {
  PRECIP_MM_FOR_MAX_INTENSITY,
  WEATHER_OVERLAY_KIND,
} from "../WeatherOverlay.constants";
import { getWeatherPeriod } from "../../helpers/getWeatherPeriod";
import {
  getWeatherSymbolBase,
  isDaytimeWeatherSymbol,
} from "../../helpers/getWeatherSymbolBase";
import { getCurrentForecastEntry } from "./getCurrentForecastEntry";
import { getPrecipitationMm } from "./getPrecipitationMm";
import {
  getPrecipKindFromSymbol,
  getSymbolIntensityFloor,
} from "./getPrecipKindFromSymbol";

const EMPTY_STATE = {
  kind: WEATHER_OVERLAY_KIND.NONE,
  intensity: 0,
  precipitationMm: 0,
  showSun: false,
  sunIntensity: 0,
  symbol: "",
};

const getSunIntensity = (symbolBase, symbolCode) => {
  if (!isDaytimeWeatherSymbol(symbolCode)) {
    return 0;
  }
  if (symbolBase === "clearsky") return 1;
  if (symbolBase === "fair") return 0.72;
  if (symbolBase === "partlycloudy") return 0.42;
  return 0;
};

const getPrecipIntensity = (mm, symbolFloor) => {
  if (mm <= 0 && symbolFloor <= 0) {
    return 0;
  }
  const fromMm =
    mm <= 0
      ? 0
      : Math.min(1, 0.28 + 0.72 * Math.sqrt(mm / PRECIP_MM_FOR_MAX_INTENSITY));
  if (mm <= 0) {
    return symbolFloor * 0.7;
  }
  return Math.min(1, Math.max(fromMm, symbolFloor));
};

const inferKindFromTemperature = (temperature) =>
  typeof temperature === "number" && temperature <= 0
    ? WEATHER_OVERLAY_KIND.SNOW
    : WEATHER_OVERLAY_KIND.RAIN;

export const getWeatherOverlayState = (forecast, now = Date.now()) => {
  const entry = getCurrentForecastEntry(forecast, now);
  if (!entry) {
    return EMPTY_STATE;
  }

  const period = getWeatherPeriod(entry);
  const symbol = period?.summary?.symbol_code || "";
  const symbolBase = getWeatherSymbolBase(symbol);
  const precipitationMm = getPrecipitationMm(period);
  const symbolFloor = getSymbolIntensityFloor(symbolBase);
  const temperature = entry?.data?.instant?.details?.air_temperature;

  let kind = getPrecipKindFromSymbol(symbolBase);
  if (!kind && precipitationMm > 0) {
    kind = inferKindFromTemperature(temperature);
  }

  const sunIntensity = getSunIntensity(symbolBase, symbol);
  const intensity = kind ? getPrecipIntensity(precipitationMm, symbolFloor) : 0;

  return {
    kind: kind || WEATHER_OVERLAY_KIND.NONE,
    intensity,
    precipitationMm,
    showSun: sunIntensity > 0,
    sunIntensity,
    symbol,
  };
};
