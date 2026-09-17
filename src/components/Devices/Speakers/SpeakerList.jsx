import React, { useEffect, useState, ViewTransition } from "react";
import { useGetDevice } from "../helpers/useGetDevice";
import { useMakeCapabilityInstance } from "../helpers/useMakeCapabilityInstance";
import { getHomey } from "../../../helpers/getHomey";
import { getDeviceAlbumArtUrl } from "../Sonos/helpers/getDeviceAlbumArtUrl";
import { getSpeakerShareName } from "./Speakers.helpers";
import "./speakers.css";

const SpeakerRow = ({
  deviceId,
  speaker,
  fallbackName,
  onSelect,
  shareDeviceId,
  shareCoverUrl,
}) => {
  const [device, setDevice] = useGetDevice(deviceId);
  const [coverFailed, setCoverFailed] = useState(false);
  useMakeCapabilityInstance(device, setDevice, "speaker_playing");
  useMakeCapabilityInstance(device, setDevice, "speaker_track");
  useMakeCapabilityInstance(device, setDevice, "speaker_artist");

  const live = device || speaker;
  const name = live?.name || fallbackName || "Høyttaler";
  const track = live?.capabilitiesObj?.speaker_track?.value;
  const artist = live?.capabilitiesObj?.speaker_artist?.value;
  const isPlaying = live?.capabilitiesObj?.speaker_playing?.value === true;
  const trackName = typeof track === "string" ? track.trim() : "";
  const artistName = typeof artist === "string" ? artist.trim() : "";
  const nowPlaying = trackName
    ? artistName
      ? `${trackName} — ${artistName}`
      : trackName
    : "Ingen avspilling";
  const shareThisRow = shareDeviceId === deviceId;
  const coverUrl =
    getDeviceAlbumArtUrl(live, trackName) ||
    (shareThisRow ? shareCoverUrl : null);
  const showArt =
    Boolean(coverUrl) &&
    !coverFailed &&
    (Boolean(trackName) || (shareThisRow && Boolean(shareCoverUrl)));
  const artShareName = shareThisRow
    ? getSpeakerShareName("art", deviceId)
    : undefined;
  const nameShareName = shareThisRow
    ? getSpeakerShareName("name", deviceId)
    : undefined;

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

  const art = showArt ? (
    <img
      className="speaker-row-art"
      src={coverUrl}
      alt=""
      onError={() => setCoverFailed(true)}
    />
  ) : (
    <span className="speaker-row-art-empty" aria-hidden>
      <sl-icon name="music-note-beamed" />
    </span>
  );
  const speakerName = <span className="speaker-row-name">{name}</span>;
  const sharedName = nameShareName ? (
    <ViewTransition
      name={nameShareName}
      share="speaker-share-name"
      enter="none"
      default="none"
    >
      {speakerName}
    </ViewTransition>
  ) : (
    speakerName
  );

  return (
    <button
      type="button"
      className={`speaker-row${trackName ? "" : " speaker-row--idle"}`}
      onClick={() => onSelect(deviceId, showArt ? coverUrl : null)}
    >
      {showArt ? (
        <>
          <span
            className="speaker-row-bleed"
            style={{ backgroundImage: `url(${coverUrl})` }}
            aria-hidden
          />
          <span className="speaker-row-shade" aria-hidden />
        </>
      ) : null}
      {artShareName ? (
        <ViewTransition
          name={artShareName}
          share="speaker-share-art"
          enter="none"
          default="none"
        >
          {art}
        </ViewTransition>
      ) : (
        art
      )}
      <span className="speaker-row-text">
        {sharedName}
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

export const SpeakerList = ({
  speakers,
  onSelect,
  shareDeviceId,
  shareCoverUrl,
}) => {
  if (!speakers.length) {
    return <div className="speaker-list-empty">Ingen høyttalere funnet</div>;
  }

  return (
    <div className="speaker-list">
      {speakers.map((speaker) => (
        <SpeakerRow
          key={speaker.id}
          deviceId={speaker.id}
          speaker={speaker}
          fallbackName={speaker.name}
          onSelect={onSelect}
          shareDeviceId={shareDeviceId}
          shareCoverUrl={shareCoverUrl}
        />
      ))}
    </div>
  );
};
