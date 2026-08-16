import { useGetDevice } from "../helpers/useGetDevice";
import { useMakeCapabilityInstance } from "../helpers/useMakeCapabilityInstance";
import React, { useEffect, useRef, useState } from "react";
import { SONOS_KITCHEN_ID } from "./Sonos";
import { FocusedElement } from "../../Focus/FocusedElement/FocusedElement";
import { getHomey } from "../../../helpers/getHomey";
import { getVolumeFromDevice } from "./helpers/getVolumeFromDevice";
import { useVolume } from "./hooks/useVolume";
import { useUpdateImageUrls } from "./hooks/useUpdateImageUrls";
import { SonosFavorites } from "./SonosFavorites";
import DefaultAlbumArt from "./assets/default_album_art.png";
import { ShuffleIcon } from "./assets/ShuffleIcon";

const isSonosDevice = (device, deviceId) =>
  deviceId === SONOS_KITCHEN_ID ||
  Boolean(
    String(device?.driverId || "")
      .toLowerCase()
      .includes("sonos")
  );

export const SonosFocus = ({
  close,
  deviceId = SONOS_KITCHEN_ID,
  title = "Sonos",
  sectionTitle,
  embedded = false,
}) => {
  const [sonosDevice, setSonosDevice] = useGetDevice(deviceId);
  const [showFavorites, setShowFavorites] = useState(false);
  const [coverFailed, setCoverFailed] = useState(false);
  const artist = sonosDevice?.capabilitiesObj?.["speaker_artist"]?.value;
  const track = sonosDevice?.capabilitiesObj?.["speaker_track"]?.value ?? "";
  const trackName = typeof track === "string" ? track.trim() : "";
  const isPlaying = sonosDevice?.capabilitiesObj?.["speaker_playing"]?.value;
  const isShuffle = sonosDevice?.capabilitiesObj?.["speaker_shuffle"]?.value;
  const caps = sonosDevice?.capabilities || [];
  const supportsShuffle = caps.includes("speaker_shuffle");
  const supportsPrev = caps.includes("speaker_prev");
  const supportsNext = caps.includes("speaker_next");
  const supportsFavorites = isSonosDevice(sonosDevice, deviceId);
  const imageRef = useRef();
  const containerRef = useRef();
  const imageUrl = useUpdateImageUrls(
    sonosDevice,
    track,
    imageRef,
    containerRef
  );
  const [volume, setVolume, onSliderChange] = useVolume(sonosDevice);
  const actualId = sonosDevice?.id;
  useEffect(() => {
    if (!actualId) {
      return;
    }
    setVolume(getVolumeFromDevice(sonosDevice));
  }, [actualId]);

  // Album art lives on device.images; refresh when the track changes (Spotify Connect).
  useEffect(() => {
    if (!deviceId || track === undefined) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const homeyApi = await getHomey();
        const fresh = await homeyApi.devices.getDevice({ id: deviceId });
        if (cancelled || !fresh) return;
        // Keep a real Homey Device instance (capability listeners need it).
        setSonosDevice(fresh);
      } catch {
        // Ignore transient Homey/API errors while artwork refreshes.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [deviceId, track, setSonosDevice]);

  useMakeCapabilityInstance(sonosDevice, setSonosDevice, "speaker_album");
  useMakeCapabilityInstance(sonosDevice, setSonosDevice, "speaker_artist");
  useMakeCapabilityInstance(sonosDevice, setSonosDevice, "speaker_playing");
  useMakeCapabilityInstance(sonosDevice, setSonosDevice, "speaker_track");
  useMakeCapabilityInstance(sonosDevice, setSonosDevice, "speaker_shuffle");

  const onPauseClick = () => {
    setPlayback(false);
  };
  const onPlayClick = () => {
    setPlayback(true);
  };

  const onShuffleClick = async () => {
    const homeyApi = await getHomey();
    homeyApi.devices.setCapabilityValue({
      deviceId: sonosDevice.id,
      capabilityId: "speaker_shuffle",
      value: !isShuffle,
    });
  };

  const onPrevClick = async () => {
    const homeyApi = await getHomey();
    homeyApi.devices.setCapabilityValue({
      deviceId: sonosDevice.id,
      capabilityId: "speaker_prev",
      value: true,
    });
  };

  const onNextClick = async () => {
    const homeyApi = await getHomey();
    homeyApi.devices.setCapabilityValue({
      deviceId: sonosDevice.id,
      capabilityId: "speaker_next",
      value: true,
    });
  };

  const setPlayback = async (playback) => {
    const homeyApi = await getHomey();
    homeyApi.devices.setCapabilityValue({
      deviceId: sonosDevice.id,
      capabilityId: "speaker_playing",
      value: playback,
    });
  };

  const onFavoriteClick = async (favorite) => {
    const homeyApi = await getHomey();
    await homeyApi.flow.runFlowCardAction({
      uri: "homey:manager:flow",
      id: `homey:device:${deviceId}:cloud_play_sonos_favorite`,
      args: { favorite },
    });
    setShowFavorites(false);
  };

  const onShowFavoriteToggle = () => {
    setShowFavorites(!showFavorites);
  };

  const hasNowPlaying = Boolean(trackName) || isPlaying === true;
  const coverUrl =
    hasNowPlaying && imageUrl && !coverFailed ? imageUrl : DefaultAlbumArt;
  const backgroundUrl =
    hasNowPlaying && imageUrl && !coverFailed ? imageUrl : undefined;

  useEffect(() => {
    setCoverFailed(false);
  }, [imageUrl, trackName, isPlaying]);

  if (showFavorites) {
    return (
      <SonosFavorites
        close={() => {
          setShowFavorites(false);
        }}
        onFavoriteClick={onFavoriteClick}
        deviceId={deviceId}
      />
    );
  }

  const content = (
    <div className="sonos-playing-container">
      <div className="sonos-playing-image-container">
        <img
          src={coverUrl}
          className="sonos-image"
          alt=""
          ref={imageRef}
          onError={() => {
            if (coverUrl !== DefaultAlbumArt) setCoverFailed(true);
          }}
        />
      </div>
      <div className="sonos-playing-content">
        <div className="sonos-playing-info">
          <div className="sonos-track-name">{trackName}</div>
          <div className="sonos-artist-name">{artist}</div>
        </div>
        <div className="sonos-buttons">
          {supportsShuffle && (
            <button
              type="button"
              className={`sonos-shuffle ${isShuffle ? "sonos-shuffle-on" : ""}`}
              onClick={onShuffleClick}
            >
              <ShuffleIcon
                className="sonos-shuffle-icon"
                fill={isShuffle ? "black" : "white"}
              />
            </button>
          )}
          {supportsPrev && (
            <button
              type="button"
              className="sonos-prev"
              onClick={onPrevClick}
            />
          )}
          {isPlaying && (
            <button
              type="button"
              className="sonos-pause"
              onClick={onPauseClick}
            />
          )}
          {!isPlaying && (
            <button
              type="button"
              className="sonos-play"
              onClick={onPlayClick}
            />
          )}
          {supportsNext && (
            <button
              type="button"
              className="sonos-next"
              onClick={onNextClick}
            />
          )}
          {supportsFavorites && (
            <button
              type="button"
              className="sonos-favorite-button"
              onClick={onShowFavoriteToggle}
            />
          )}
        </div>
        <div className="sonos-playing-volume">
          <span className="sonos-volume-down" />
          <input
            className="sonos-playing-volume-slider"
            type="range"
            id="volume"
            name="volume"
            min="0"
            max="100"
            value={volume}
            onChange={onSliderChange}
          />
          <span className="sonos-volume-up" />
        </div>
      </div>
    </div>
  );

  if (embedded) {
    return (
      <div className="sonos-embedded">
        <div
          className="sonos-embedded-background"
          ref={containerRef}
          style={
            backgroundUrl
              ? { backgroundImage: `url(${backgroundUrl})` }
              : undefined
          }
          aria-hidden
        />
        <div className="sonos-embedded-content">
          {sectionTitle ? (
            <h2 className="andre-section-title sonos-embedded-title">
              {sectionTitle}
            </h2>
          ) : null}
          {content}
        </div>
      </div>
    );
  }

  return (
    <FocusedElement
      title={title}
      onCloseClick={close}
      backgroundImageUrl={backgroundUrl}
      ref={containerRef}
    >
      {content}
    </FocusedElement>
  );
};
