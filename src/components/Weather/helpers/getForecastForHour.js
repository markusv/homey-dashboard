export const getForecastForHour = (hour, forecast) => {
  return forecast.find((f) => new Date(f.time).getHours() === hour);
};
