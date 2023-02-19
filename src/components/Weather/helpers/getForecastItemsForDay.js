import { getForecastForHour } from "./getForecastForHour";

export const getForecastItemsForDay = (forecastForDay) => {
  if (forecastForDay.length === 24) {
    return [
      getForecastForHour(5, forecastForDay),
      getForecastForHour(10, forecastForDay),
      getForecastForHour(15, forecastForDay),
      getForecastForHour(20, forecastForDay) ||
        getForecastForHour(23, forecastForDay),
    ];
  }
  return [
    getForecastForHour(1, forecastForDay),
    getForecastForHour(7, forecastForDay),
    getForecastForHour(13, forecastForDay),
    getForecastForHour(19, forecastForDay) ||
      getForecastForHour(23, forecastForDay),
  ];
};
