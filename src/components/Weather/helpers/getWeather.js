export const getWeather = async () => {
  const response = await fetch(
    "https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=59.9340&lon=10.8252"
  );
  if (!response.ok) {
    return null;
  }
  const jsonResponse = await response.json();
  return jsonResponse.properties.timeseries;
};
