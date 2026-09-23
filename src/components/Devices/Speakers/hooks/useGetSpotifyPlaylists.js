import { use } from "react";
import { getHomey } from "../../../../helpers/getHomey";
import {
  readCachedSpotifyPlaylists,
  writeCachedSpotifyPlaylists,
} from "../helpers/cacheSpotifyPlaylists";
import { getSpotifyPlayPlaylistCardId } from "../Speakers.helpers";
import { uniquePlaylists } from "../helpers/uniquePlaylists";

export const SPOTIFY_PLAYLISTS_RETRY_MS = 10_000;
export const SPOTIFY_PLAYLISTS_REFRESH_MS = 5 * 60 * 1000;
const UNAVAILABLE_MESSAGE =
  "Spotify Connect er ikke tilgjengelig i Homey. Playlister lastes når høyttaleren er online.";

const playlistsByDeviceId = new Map();
const fetchedAtByDeviceId = new Map();
const inflightByDeviceId = new Map();

const asFulfilled = (value) => ({
  status: "fulfilled",
  value,
  then: (resolve) => Promise.resolve(value).then(resolve),
});

const emptyPlaylists = {
  playlists: [],
  fromCache: false,
  error: undefined,
};

const fetchSpotifyPlaylists = async (deviceId) => {
  const cached = readCachedSpotifyPlaylists(deviceId);
  try {
    const homeyApi = await getHomey();
    const device = await homeyApi.devices.getDevice({ id: deviceId });
    if (!device?.available) {
      throw new Error(UNAVAILABLE_MESSAGE);
    }
    const result = await homeyApi.flow.getFlowCardAutocomplete({
      uri: "homey:manager:flow",
      id: getSpotifyPlayPlaylistCardId(deviceId),
      name: "playlist",
      query: "",
      type: "flowcardaction",
    });
    const playlists = uniquePlaylists(result);
    writeCachedSpotifyPlaylists(deviceId, playlists);
    const next = { playlists, fromCache: false, error: undefined };
    playlistsByDeviceId.set(deviceId, asFulfilled(next));
    fetchedAtByDeviceId.set(deviceId, Date.now());
    return next;
  } catch (caught) {
    const message = String(caught?.message || "");
    const unavailable = /ikke tilgjengelig/i.test(message);
    if (cached.length) {
      const next = {
        playlists: uniquePlaylists(cached),
        fromCache: true,
        error: undefined,
      };
      playlistsByDeviceId.set(deviceId, asFulfilled(next));
      return next;
    }
    const next = {
      playlists: [],
      fromCache: false,
      error: unavailable
        ? UNAVAILABLE_MESSAGE
        : message || "Kunne ikke hente Spotify-playlister",
    };
    playlistsByDeviceId.set(deviceId, asFulfilled(next));
    return next;
  }
};

export const loadLiveSpotifyPlaylists = (deviceId) => {
  const pending = inflightByDeviceId.get(deviceId);
  if (pending) return pending;
  const task = fetchSpotifyPlaylists(deviceId).finally(() => {
    inflightByDeviceId.delete(deviceId);
  });
  inflightByDeviceId.set(deviceId, task);
  return task;
};

export const prefetchSpotifyPlaylists = (deviceId) => {
  if (!deviceId) return;
  const fetchedAt = fetchedAtByDeviceId.get(deviceId) || 0;
  if (Date.now() - fetchedAt < SPOTIFY_PLAYLISTS_REFRESH_MS) return;

  const resource = getSpotifyPlaylistsResource(deviceId);
  Promise.resolve(resource).then((result) => {
    if (!result?.fromCache && !result?.error) {
      fetchedAtByDeviceId.set(deviceId, Date.now());
      return;
    }
    loadLiveSpotifyPlaylists(deviceId).then((next) => {
      if (!next.fromCache && !next.error) {
        fetchedAtByDeviceId.set(deviceId, Date.now());
      }
    });
  });
};

export const getSpotifyPlaylistsResource = (deviceId) => {
  if (!deviceId) return asFulfilled(emptyPlaylists);
  const cachedResource = playlistsByDeviceId.get(deviceId);
  if (cachedResource) return cachedResource;
  const local = uniquePlaylists(readCachedSpotifyPlaylists(deviceId));
  if (local.length) {
    const resource = asFulfilled({
      playlists: local,
      fromCache: true,
      error: undefined,
    });
    playlistsByDeviceId.set(deviceId, resource);
    return resource;
  }
  const resource = loadLiveSpotifyPlaylists(deviceId);
  playlistsByDeviceId.set(deviceId, resource);
  return resource;
};

export const useGetSpotifyPlaylists = (deviceId) =>
  use(getSpotifyPlaylistsResource(deviceId));

export const playSpotifyPlaylist = async (deviceId, playlist) => {
  const homeyApi = await getHomey();
  await homeyApi.flow.runFlowCardAction({
    uri: "homey:manager:flow",
    id: getSpotifyPlayPlaylistCardId(deviceId),
    args: { playlist },
  });
};
