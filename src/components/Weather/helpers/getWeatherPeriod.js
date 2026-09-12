export const getWeatherPeriod = (entry) =>
  entry?.data?.next_1_hours ||
  entry?.data?.next_6_hours ||
  entry?.data?.next_12_hours ||
  null;
