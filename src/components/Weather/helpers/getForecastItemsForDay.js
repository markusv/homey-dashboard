import { getForecastForHour } from "./getForecastForHour";
import { isDaylightSavingsTime } from "./isDaylightSavingsTime";

export const getForecastItemsForDay = (forecastForDay) => {
  if (forecastForDay.length === 24) {
    return [
      getForecastForHour(!isDaylightSavingsTime() ? 5 : 6, forecastForDay),
      getForecastForHour(!isDaylightSavingsTime() ? 10 : 11, forecastForDay),
      getForecastForHour(!isDaylightSavingsTime() ? 15 : 16, forecastForDay),
      getForecastForHour(!isDaylightSavingsTime() ? 20 : 21, forecastForDay) ||
        getForecastForHour(!isDaylightSavingsTime() ? 23 : 24, forecastForDay),
    ];
  }
  return [
    getForecastForHour(!isDaylightSavingsTime() ? 1 : 2, forecastForDay),
    getForecastForHour(!isDaylightSavingsTime() ? 7 : 8, forecastForDay),
    getForecastForHour(!isDaylightSavingsTime() ? 13 : 14, forecastForDay),
    getForecastForHour(!isDaylightSavingsTime() ? 19 : 20, forecastForDay) ||
      getForecastForHour(!isDaylightSavingsTime() ? 23 : 24, forecastForDay),
  ];
};
