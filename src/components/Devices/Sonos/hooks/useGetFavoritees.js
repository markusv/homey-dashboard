import { use } from "react";
import { getHomey } from "../../../../helpers/getHomey";
import {
  readCachedSonosFavorites,
  writeCachedSonosFavorites,
} from "../helpers/cacheSonosFavorites";

export const SONOS_FAVORITES_REFRESH_MS = 5 * 60 * 1000;
export const SONOS_FAVORITES_RETRY_MS = 10_000;

const favoritesByDeviceId = new Map();
const fetchedAtByDeviceId = new Map();
const inflightByDeviceId = new Map();

const asFulfilled = (value) => ({
  status: "fulfilled",
  value,
  then: (resolve) => Promise.resolve(value).then(resolve),
});

const fetchSonosFavorites = async (deviceId) => {
  const homeyApi = await getHomey();
  const favorites = await homeyApi.flow.getFlowCardAutocomplete({
    uri: "homey:manager:flow",
    id: `homey:device:${deviceId}:cloud_play_sonos_favorite`,
    name: "favorite",
    query: "",
    type: "flowcardaction",
  });
  return favorites ?? [];
};

export const loadLiveSonosFavorites = (deviceId) => {
  const pending = inflightByDeviceId.get(deviceId);
  if (pending) return pending;

  const task = fetchSonosFavorites(deviceId)
    .then((favorites) => {
      writeCachedSonosFavorites(deviceId, favorites);
      const next = { favorites, fromCache: false, error: false };
      favoritesByDeviceId.set(deviceId, asFulfilled(next));
      fetchedAtByDeviceId.set(deviceId, Date.now());
      return next;
    })
    .catch(() => {
      const favorites = readCachedSonosFavorites(deviceId);
      if (favorites.length) {
        const next = { favorites, fromCache: true, error: true };
        favoritesByDeviceId.set(deviceId, asFulfilled(next));
        return next;
      }
      favoritesByDeviceId.delete(deviceId);
      return { favorites: [], fromCache: false, error: true };
    })
    .finally(() => {
      inflightByDeviceId.delete(deviceId);
    });

  inflightByDeviceId.set(deviceId, task);
  return task;
};

export const getSonosFavoritesResource = (deviceId) => {
  if (!deviceId) {
    return asFulfilled({ favorites: [], fromCache: false, error: false });
  }
  const cached = favoritesByDeviceId.get(deviceId);
  if (cached) return cached;

  const local = readCachedSonosFavorites(deviceId);
  if (local.length) {
    const resource = asFulfilled({
      favorites: local,
      fromCache: true,
      error: false,
    });
    favoritesByDeviceId.set(deviceId, resource);
    return resource;
  }

  const resource = loadLiveSonosFavorites(deviceId);
  favoritesByDeviceId.set(deviceId, resource);
  return resource;
};

export const prefetchSonosFavorites = (deviceId) => {
  if (!deviceId) return;
  const fetchedAt = fetchedAtByDeviceId.get(deviceId) || 0;
  if (
    favoritesByDeviceId.has(deviceId) &&
    Date.now() - fetchedAt < SONOS_FAVORITES_REFRESH_MS
  ) {
    return;
  }
  loadLiveSonosFavorites(deviceId);
};

export const useGetFavoritees = (deviceId) =>
  use(getSonosFavoritesResource(deviceId));
