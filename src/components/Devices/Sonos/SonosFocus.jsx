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

export const SonosFocus = ({
  close,
  deviceId = SONOS_KITCHEN_ID,
  title = "Sonos",
  embedded = false,
}) => {
  const [sonosDevice, setSonosDevice] = useGetDevice(deviceId);
  const [showFavorites, setShowFavorites] = useState(false);
  const artist = sonosDevice?.capabilitiesObj?.["speaker_artist"]?.value;
  const track = sonosDevice?.capabilitiesObj?.["speaker_track"]?.value ?? "";
  const isPlaying = sonosDevice?.capabilitiesObj?.["speaker_playing"]?.value;
  const isShuffle = sonosDevice?.capabilitiesObj?.["speaker_shuffle"]?.value;
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

  useMakeCapabilityInstance(sonosDevice, setSonosDevice, "speaker_album");
  useMakeCapabilityInstance(sonosDevice, setSonosDevice, "speaker_artist");
  useMakeCapabilityInstance(sonosDevice, setSonosDevice, "speaker_playing");
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
          src={imageUrl ?? DefaultAlbumArt}
          className="sonos-image"
          ref={imageRef}
        />
      </div>
      <div className="sonos-playing-content">
        <div className="sonos-playing-info">
          <div className="sonos-track-name">{track}</div>
          <div className="sonos-artist-name">{artist}</div>
        </div>
        <div className="sonos-buttons">
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
          <button type="button" className="sonos-prev" onClick={onPrevClick} />
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
          <button type="button" className="sonos-next" onClick={onNextClick} />
          <button
            className="sonos-favorite-button"
            onClick={onShowFavoriteToggle}
          />
        </div>
        <div className="sonos-playing-volume">
          <span className="sonos-volume-down" />
          <input
            className="sonos-playing-volume-slider"
            type="range"
            id="volume"
            name="volume"
            min="0"
            max="50"
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
      <div className="sonos-embedded" ref={containerRef}>
        {content}
      </div>
    );
  }

  return (
    <FocusedElement
      title={title}
      onCloseClick={close}
      backgroundImageUrl={imageUrl}
      ref={containerRef}
    >
      {content}
    </FocusedElement>
  );
};
