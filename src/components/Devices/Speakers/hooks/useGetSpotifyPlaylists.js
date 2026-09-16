import { use } from "react";
import { getHomey } from "../../../../helpers/getHomey";
import {
  readCachedSpotifyPlaylists,
  writeCachedSpotifyPlaylists,
} from "../helpers/cacheSpotifyPlaylists";
import { getSpotifyPlayPlaylistCardId } from "../Speakers.helpers";

export const SPOTIFY_PLAYLISTS_RETRY_MS = 10_000;
const UNAVAILABLE_MESSAGE =
  "Spotify Connect er ikke tilgjengelig i Homey. Playlister lastes når høyttaleren er online.";

const playlistsByDeviceId = new Map();

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

export const loadLiveSpotifyPlaylists = async (deviceId) => {
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
    const playlists = result ?? [];
    writeCachedSpotifyPlaylists(deviceId, playlists);
    const next = { playlists, fromCache: false, error: undefined };
    playlistsByDeviceId.set(deviceId, asFulfilled(next));
    return next;
  } catch (caught) {
    const message = String(caught?.message || "");
    const unavailable = /ikke tilgjengelig/i.test(message);
    if (cached.length) {
      const next = { playlists: cached, fromCache: true, error: undefined };
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

export const getSpotifyPlaylistsResource = (deviceId) => {
  if (!deviceId) return asFulfilled(emptyPlaylists);
  const cachedResource = playlistsByDeviceId.get(deviceId);
  if (cachedResource) return cachedResource;
  const local = readCachedSpotifyPlaylists(deviceId);
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
