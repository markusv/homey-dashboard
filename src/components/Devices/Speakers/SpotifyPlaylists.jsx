import React, { Suspense, useEffect, useState } from "react";
import "../Sonos/sonos.css";
import "./speakers.css";
import { FavoritesSkeleton } from "../Sonos/FavoritesSkeleton";
import {
  loadLiveSpotifyPlaylists,
  playSpotifyPlaylist,
  SPOTIFY_PLAYLISTS_RETRY_MS,
  useGetSpotifyPlaylists,
} from "./hooks/useGetSpotifyPlaylists";

const SpotifyPlaylistsFallback = () => (
  <div className="speaker-library-cached">
    <div className="speaker-library-status" aria-hidden />
    <FavoritesSkeleton />
  </div>
);

const SpotifyPlaylistsList = ({ deviceId, onPlaylistClick }) => {
  const initial = useGetSpotifyPlaylists(deviceId);
  const [result, setResult] = useState(initial);
  const [playError, setPlayError] = useState();

  useEffect(() => {
    setResult(initial);
    let cancelled = false;
    let retryTimer;

    const schedule = (current, delay) => {
      if (!current.error && !current.fromCache) return;
      retryTimer = setTimeout(() => {
        loadLiveSpotifyPlaylists(deviceId).then((next) => {
          if (cancelled) return;
          setResult(next);
          schedule(next, SPOTIFY_PLAYLISTS_RETRY_MS);
        });
      }, delay);
    };

    schedule(initial, initial.fromCache ? 0 : SPOTIFY_PLAYLISTS_RETRY_MS);

    return () => {
      cancelled = true;
      clearTimeout(retryTimer);
    };
  }, [deviceId, initial]);

  const onClick = async (playlist) => {
    setPlayError(undefined);
    try {
      await playSpotifyPlaylist(deviceId, playlist);
      onPlaylistClick?.();
    } catch (caught) {
      const message = String(caught?.message || "");
      setPlayError(
        /ikke tilgjengelig/i.test(message)
          ? "Kunne ikke starte avspilling. Start gjerne noe i Spotify-appen først."
          : message || "Kunne ikke starte avspilling"
      );
    }
  };

  if (result.error) {
    return <div className="speaker-list-empty">{result.error}</div>;
  }

  if (!result.playlists.length) {
    return <div className="speaker-list-empty">Ingen playlister funnet</div>;
  }

  const status = playError
    ? playError
    : result.fromCache
      ? "Sist hentet liste — Connect var nede"
      : "";

  return (
    <div className="speaker-library-cached">
      <div
        className={
          playError
            ? "speaker-library-status speaker-library-error"
            : "speaker-library-status speaker-library-cache-note"
        }
      >
        {status}
      </div>
      <div className="sonos-favorites-container">
        {result.playlists.map((playlist) => (
          <div
            key={playlist.id || playlist.uri || playlist.name}
            className="sonos-favorites"
            onClick={() => onClick(playlist)}
          >
            {playlist.image ? (
              <img
                src={playlist.image}
                className="sonos-favorites-image"
                alt=""
                width="100"
                height="100"
              />
            ) : (
              <span className="sonos-favorites-image" aria-hidden />
            )}
            <span className="sonos-favorites-name">{playlist.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SpotifyPlaylists = (props) => (
  <Suspense fallback={<SpotifyPlaylistsFallback />}>
    <SpotifyPlaylistsList {...props} />
  </Suspense>
);
