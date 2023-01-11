export const getMinMaxTempForDay = (forecast) => {
  let min = 100;
  let max = 0;
  forecast.forEach((f) => {
    const tempperature = f.data.instant.details.air_temperature;
    if (tempperature < min) min = tempperature;
    if (tempperature > max) max = tempperature;
  });
  return { min, max };
};
