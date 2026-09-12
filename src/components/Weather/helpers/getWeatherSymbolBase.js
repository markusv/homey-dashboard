export const getWeatherSymbolBase = (symbolCode) => {
  if (!symbolCode) return "";
  return String(symbolCode)
    .replace(/_day$/, "")
    .replace(/_night$/, "")
    .replace(/_polartwilight$/, "");
};

export const isDaytimeWeatherSymbol = (symbolCode) =>
  String(symbolCode || "").endsWith("_day");
