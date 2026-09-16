import React, { useEffect, useState } from "react";
import { useGetDevice } from "../helpers/useGetDevice";
import { useMakeCapabilityInstance } from "../helpers/useMakeCapabilityInstance";
import { getHomey } from "../../../helpers/getHomey";
import { getImageUrl } from "../Sonos/helpers/getImageUrl";
import { resolveAlbumArtUrl } from "../Sonos/helpers/resolveAlbumArtUrl";
import "./speakers.css";

const SpeakerRow = ({ deviceId, fallbackName, onSelect }) => {
  const [device, setDevice] = useGetDevice(deviceId);
  const [coverFailed, setCoverFailed] = useState(false);
  useMakeCapabilityInstance(device, setDevice, "speaker_playing");
  useMakeCapabilityInstance(device, setDevice, "speaker_track");
  useMakeCapabilityInstance(device, setDevice, "speaker_artist");

  const name = device?.name || fallbackName || "Høyttaler";
  const track = device?.capabilitiesObj?.speaker_track?.value;
  const artist = device?.capabilitiesObj?.speaker_artist?.value;
  const isPlaying = device?.capabilitiesObj?.speaker_playing?.value === true;
  const trackName = typeof track === "string" ? track.trim() : "";
  const artistName = typeof artist === "string" ? artist.trim() : "";
  const nowPlaying = trackName
    ? artistName
      ? `${trackName} — ${artistName}`
      : trackName
    : "Ingen avspilling";
  const coverUrl = resolveAlbumArtUrl(getImageUrl(device), trackName);
  const showArt = Boolean(coverUrl) && !coverFailed && Boolean(trackName);

  useEffect(() => {
    setCoverFailed(false);
  }, [coverUrl, trackName]);

  useEffect(() => {
    if (!deviceId || track === undefined) return undefined;
    let cancelled = false;
    const refresh = async () => {
      try {
        const homeyApi = await getHomey();
        const fresh = await homeyApi.devices.getDevice({ id: deviceId });
        if (cancelled || !fresh) return;
        setDevice(fresh);
      } catch {
        // Ignore transient Homey errors while artwork refreshes.
      }
    };
    refresh();
    return () => {
      cancelled = true;
    };
  }, [deviceId, track, setDevice]);

  return (
    <button
      type="button"
      className={`speaker-row${trackName ? "" : " speaker-row--idle"}`}
      onClick={() => onSelect(deviceId)}
    >
      {showArt ? (
        <>
          <span
            className="speaker-row-bleed"
            style={{ backgroundImage: `url(${coverUrl})` }}
            aria-hidden
          />
          <span className="speaker-row-shade" aria-hidden />
          <img
            className="speaker-row-art"
            src={coverUrl}
            alt=""
            onError={() => setCoverFailed(true)}
          />
        </>
      ) : (
        <span className="speaker-row-art-empty" aria-hidden>
          <sl-icon name="music-note-beamed" />
        </span>
      )}
      <span className="speaker-row-text">
        <span className="speaker-row-name">{name}</span>
        <span className="speaker-row-track">{nowPlaying}</span>
      </span>
      {isPlaying ? (
        <span className="speaker-row-live" aria-hidden>
          <span />
          <span />
          <span />
        </span>
      ) : null}
    </button>
  );
};

export const SpeakerList = ({ speakers, onSelect }) => {
  if (!speakers.length) {
    return <div className="speaker-list-empty">Ingen høyttalere funnet</div>;
  }

  return (
    <div className="speaker-list">
      {speakers.map((speaker) => (
        <SpeakerRow
          key={speaker.id}
          deviceId={speaker.id}
          fallbackName={speaker.name}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};
