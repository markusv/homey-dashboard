const LOOKAHEAD_MS = 20 * 60 * 1000;

export const getCurrentForecastEntry = (forecast, now = Date.now()) => {
  if (!Array.isArray(forecast) || forecast.length === 0) {
    return null;
  }

  const cutoff = now + LOOKAHEAD_MS;
  return forecast.reduce((current, entry) => {
    const time = new Date(entry?.time).getTime();
    if (Number.isNaN(time) || time > cutoff) {
      return current;
    }
    if (!current) {
      return entry;
    }
    return time >= new Date(current.time).getTime() ? entry : current;
  }, null);
};
