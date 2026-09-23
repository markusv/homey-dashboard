const cacheKey = (deviceId) => `homey-dashboard:sonos-favorites:${deviceId}`;

export const parseCachedFavorites = (raw) => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const readCachedSonosFavorites = (deviceId) => {
  if (!deviceId || typeof localStorage === "undefined") return [];
  try {
    return parseCachedFavorites(localStorage.getItem(cacheKey(deviceId)));
  } catch {
    return [];
  }
};

export const writeCachedSonosFavorites = (deviceId, favorites) => {
  if (!deviceId || typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(cacheKey(deviceId), JSON.stringify(favorites ?? []));
  } catch {
    // Ignore quota / private-mode failures.
  }
};
