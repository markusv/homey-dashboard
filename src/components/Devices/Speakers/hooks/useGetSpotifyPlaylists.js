import { useEffect, useState } from "react";
import { getHomey } from "../../../../helpers/getHomey";
import {
  readCachedSpotifyPlaylists,
  writeCachedSpotifyPlaylists,
} from "../helpers/cacheSpotifyPlaylists";
import { getSpotifyPlayPlaylistCardId } from "../Speakers.helpers";

const RETRY_MS = 10_000;
const UNAVAILABLE_MESSAGE =
  "Spotify Connect er ikke tilgjengelig i Homey. Playlister lastes når høyttaleren er online.";

export const useGetSpotifyPlaylists = (deviceId) => {
  const [loading, setLoading] = useState(true);
  const [playlists, setPlaylists] = useState([]);
  const [fromCache, setFromCache] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    if (!deviceId) {
      setLoading(false);
      setPlaylists([]);
      setFromCache(false);
      setError(undefined);
      return undefined;
    }

    let cancelled = false;
    let retryTimer;
    const cached = readCachedSpotifyPlaylists(deviceId);
    if (cached.length) {
      setPlaylists(cached);
      setFromCache(true);
      setLoading(false);
    }

    const load = async ({ silent } = {}) => {
      if (!silent && !cached.length) setLoading(true);
      try {
        const homeyApi = await getHomey();
        const device = await homeyApi.devices.getDevice({ id: deviceId });
        if (cancelled) return;
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
        if (cancelled) return;
        const list = result ?? [];
        writeCachedSpotifyPlaylists(deviceId, list);
        setPlaylists(list);
        setFromCache(false);
        setError(undefined);
        setLoading(false);
      } catch (caught) {
        if (cancelled) return;
        const fallback = readCachedSpotifyPlaylists(deviceId);
        const message = String(caught?.message || "");
        const unavailable = /ikke tilgjengelig/i.test(message);
        if (fallback.length) {
          setPlaylists(fallback);
          setFromCache(true);
          setError(undefined);
        } else {
          setPlaylists([]);
          setFromCache(false);
          setError(
            unavailable
              ? UNAVAILABLE_MESSAGE
              : message || "Kunne ikke hente Spotify-playlister"
          );
        }
        setLoading(false);
        clearTimeout(retryTimer);
        retryTimer = setTimeout(() => load({ silent: true }), RETRY_MS);
      }
    };

    load();
    return () => {
      cancelled = true;
      clearTimeout(retryTimer);
    };
  }, [deviceId]);

  return { loading, playlists, fromCache, error };
};

export const playSpotifyPlaylist = async (deviceId, playlist) => {
  const homeyApi = await getHomey();
  await homeyApi.flow.runFlowCardAction({
    uri: "homey:manager:flow",
    id: getSpotifyPlayPlaylistCardId(deviceId),
    args: { playlist },
  });
};
