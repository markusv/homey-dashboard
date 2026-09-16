const cacheKey = (deviceId) => `homey-dashboard:spotify-playlists:${deviceId}`;

export const parseCachedPlaylists = (raw) => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const readCachedSpotifyPlaylists = (deviceId) => {
  if (!deviceId || typeof localStorage === "undefined") return [];
  try {
    return parseCachedPlaylists(localStorage.getItem(cacheKey(deviceId)));
  } catch {
    return [];
  }
};

export const writeCachedSpotifyPlaylists = (deviceId, playlists) => {
  if (!deviceId || typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(cacheKey(deviceId), JSON.stringify(playlists ?? []));
  } catch {
    // Ignore quota / private-mode failures.
  }
};
