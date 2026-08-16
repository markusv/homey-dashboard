export const getWeather = async () => {
  const response = await fetch("/api/read/weather");
  if (!response.ok) {
    return null;
  }
  const jsonResponse = await response.json();
  return jsonResponse.timeseries;
};
