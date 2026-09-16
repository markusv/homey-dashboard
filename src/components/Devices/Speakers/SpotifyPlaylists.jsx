import React, { useState } from "react";
import "../Sonos/sonos.css";
import "./speakers.css";
import {
  playSpotifyPlaylist,
  useGetSpotifyPlaylists,
} from "./hooks/useGetSpotifyPlaylists";

export const SpotifyPlaylists = ({ deviceId, onPlaylistClick }) => {
  const { loading, playlists, fromCache, error } =
    useGetSpotifyPlaylists(deviceId);
  const [playError, setPlayError] = useState();

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

  if (loading) {
    return <div className="sonos-favorites-loading">Laster…</div>;
  }

  if (error) {
    return <div className="speaker-list-empty">{error}</div>;
  }

  if (!playlists.length) {
    return <div className="speaker-list-empty">Ingen playlister funnet</div>;
  }

  return (
    <div className="speaker-library-cached">
      {fromCache ? (
        <div className="speaker-library-cache-note">
          Sist hentet liste — Connect var nede
        </div>
      ) : null}
      {playError ? (
        <div className="speaker-library-error">{playError}</div>
      ) : null}
      <div className="sonos-favorites-container">
        {playlists.map((playlist) => (
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
              />
            ) : null}
            {playlist.name}
          </div>
        ))}
      </div>
    </div>
  );
};
