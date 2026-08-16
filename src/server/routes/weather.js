const MET_FORECAST_URL =
  "https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=59.9340&lon=10.8252";
const CACHE_TTL_MS = 60 * 60 * 1000;
const USER_AGENT =
  "homey-dashboard/0.1.0 (personal smart-home dashboard; +https://github.com/)";

let cache = {
  timeseries: null,
  fetchedAt: null,
};

let inFlight = null;

const fetchForecastFromMet = async () => {
  const response = await fetch(MET_FORECAST_URL, {
    headers: {
      Accept: "application/json",
      "User-Agent": USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new Error(`MET forecast request failed with ${response.status}`);
  }

  const json = await response.json();
  const timeseries = json?.properties?.timeseries;

  if (!Array.isArray(timeseries)) {
    throw new Error("MET forecast response missing timeseries");
  }

  cache = {
    timeseries,
    fetchedAt: Date.now(),
  };

  return cache;
};

const getCachedForecast = async () => {
  const isFresh =
    cache.timeseries &&
    cache.fetchedAt != null &&
    Date.now() - cache.fetchedAt < CACHE_TTL_MS;

  if (isFresh) {
    return cache;
  }

  if (!inFlight) {
    inFlight = fetchForecastFromMet().finally(() => {
      inFlight = null;
    });
  }

  try {
    return await inFlight;
  } catch (error) {
    if (cache.timeseries) {
      console.warn(
        "[weather] MET refresh failed; serving stale cache:",
        error.message || error
      );
      return cache;
    }
    throw error;
  }
};

export const getWeather = async (_req, res) => {
  try {
    const { timeseries, fetchedAt } = await getCachedForecast();
    res.json({
      timeseries,
      fetchedAt: new Date(fetchedAt).toISOString(),
      source: "met.no",
    });
  } catch (error) {
    console.error("[weather]", error);
    res.status(502).json({
      error: "met_forecast_failed",
      message: error.message || String(error),
    });
  }
};

export const registerWeatherRoutes = (app) => {
  app.get("/api/read/weather", getWeather);

  // Warm the cache on startup so the first dashboard load is not delayed.
  getCachedForecast().catch((error) => {
    console.warn(
      "[weather] startup cache warm failed:",
      error.message || error
    );
  });
};
