import { getWeatherSymbolBase } from "../../../components/Weather/helpers/getWeatherSymbolBase";

export { getWeatherPeriod } from "../../../components/Weather/helpers/getWeatherPeriod";

/** Short Norwegian labels for MET symbol_code (base without _day/_night). */
const SYMBOL_LABELS = {
  clearsky: "Klarvær",
  fair: "Lettskyet",
  partlycloudy: "Delvis skyet",
  cloudy: "Skyet",
  fog: "Tåke",
  lightrain: "Lett regn",
  rain: "Regn",
  heavyrain: "Kraftig regn",
  lightrainshowers: "Lette regnbyger",
  rainshowers: "Regnbyger",
  heavyrainshowers: "Kraftige regnbyger",
  lightsleet: "Lett sludd",
  sleet: "Sludd",
  heavysleet: "Kraftig sludd",
  lightsnow: "Lett snø",
  snow: "Snø",
  heavysnow: "Kraftig snø",
  lightsnowshowers: "Lette snøbyger",
  snowshowers: "Snøbyger",
  heavysnowshowers: "Kraftige snøbyger",
  rainandthunder: "Regn og torden",
  lightrainandthunder: "Lett regn og torden",
  heavyrainandthunder: "Kraftig regn og torden",
  snowandthunder: "Snø og torden",
};

export const getWeatherSymbolLabel = (symbolCode) => {
  if (!symbolCode) return "Vær";
  const base = getWeatherSymbolBase(symbolCode);
  return SYMBOL_LABELS[base] || "Vær";
};

export const getWeatherIconUrl = (symbolCode) =>
  `${import.meta.env.BASE_URL}dashboardAssets/weatherIcons/${symbolCode}.svg`;
