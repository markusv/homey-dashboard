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

export const SonosFocus = ({ close }) => {
  const [sonosKitchen, setSonosKitchen] = useGetDevice(SONOS_KITCHEN_ID);
  const [showFavorites, setShowFavorites] = useState(false);
  const artist = sonosKitchen?.capabilitiesObj?.["speaker_artist"]?.value;
  const track = sonosKitchen?.capabilitiesObj?.["speaker_track"]?.value ?? "";
  const isPlaying = sonosKitchen?.capabilitiesObj?.["speaker_playing"]?.value;
  const imageRef = useRef();
  const containerRef = useRef();
  const imageUrl = useUpdateImageUrls(
    sonosKitchen,
    track,
    imageRef,
    containerRef
  );
  const [volume, setVolume, onSliderChange] = useVolume(sonosKitchen);
  const actualId = sonosKitchen?.id;
  useEffect(() => {
    if (!actualId) {
      return;
    }
    setVolume(getVolumeFromDevice(sonosKitchen));
  }, [actualId]);

  useMakeCapabilityInstance(sonosKitchen, setSonosKitchen, "speaker_album");
  useMakeCapabilityInstance(sonosKitchen, setSonosKitchen, "speaker_artist");
  useMakeCapabilityInstance(sonosKitchen, setSonosKitchen, "speaker_playing");
  useMakeCapabilityInstance(sonosKitchen, setSonosKitchen, "speaker_playing");
  useMakeCapabilityInstance(sonosKitchen, setSonosKitchen, "speaker_track");

  const onPauseClick = () => {
    setPlayback(false);
  };
  const onPlayClick = () => {
    setPlayback(true);
  };

  const onPrevClick = async () => {
    const homeyApi = await getHomey();
    homeyApi.devices.setCapabilityValue({
      deviceId: sonosKitchen.id,
      capabilityId: "speaker_prev",
      value: true,
    });
  };

  const onNextClick = async () => {
    const homeyApi = await getHomey();
    homeyApi.devices.setCapabilityValue({
      deviceId: sonosKitchen.id,
      capabilityId: "speaker_next",
      value: true,
    });
  };

  const setPlayback = async (playback) => {
    const homeyApi = await getHomey();
    homeyApi.devices.setCapabilityValue({
      deviceId: sonosKitchen.id,
      capabilityId: "speaker_playing",
      value: playback,
    });
  };

  const onFavoriteClick = async (favorite) => {
    const homeyApi = await getHomey();
    await homeyApi.flow.runFlowCardAction({
      uri: "homey:manager:flow",
      id: `homey:device:${SONOS_KITCHEN_ID}:cloud_play_sonos_favorite`,
      args: { favorite },
    });
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
      />
    );
  }

  return (
    <FocusedElement
      title="Sonos"
      onCloseClick={close}
      backgroundImageUrl={imageUrl}
      ref={containerRef}
    >
      <div className="sonos-playing-container">
        <div className="sonos-playing-image-container">
          <img
            src={imageUrl ?? DefaultAlbumArt}
            className="sonos-image"
            ref={imageRef}
          />
        </div>
        <div className="sonos-playing-content">
          <div className="sonos-control-buttons">
            <button
              className="sonos-favorite-button"
              onClick={onShowFavoriteToggle}
            >
              Favoritter
            </button>
          </div>
          <div className="sonos-playing-info">
            <div className="sonos-track-name">{track}</div>
            <div className="sonos-artist-name">{artist}</div>
          </div>
          <div className="sonos-buttons">
            <button
              tpye="button"
              className="sonos-prev"
              onClick={onPrevClick}
            />
            {isPlaying && (
              <button
                tpye="button"
                className="sonos-pause"
                onClick={onPauseClick}
              />
            )}
            {!isPlaying && (
              <button
                tpye="button"
                className="sonos-play"
                onClick={onPlayClick}
              />
            )}
            <button
              tpye="button"
              className="sonos-next"
              onClick={onNextClick}
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
    </FocusedElement>
  );
};
