import React from "react";
import "./audiopro.css";
import { SlButton } from "@shoelace-style/shoelace/dist/react";
import { triggerFlow } from "../../Flows/helpers/triggerFlow";
import {
  AUDIO_PRO_PAUSE_FLOW_ID,
  AUDIO_PRO_PLAY_DANCE_CLASSICS_FLOW_ID,
  AUDIO_PRO_PLAY_MUSIC_FLOW_ID,
  AUDIO_PRO_PLAY_RYDDETID_FLOW_ID,
  AUDIO_PRO_PLAY_SLOW_MUSIC_FLOW_ID,
} from "./constants";

export const AudioProSpeakerFocus = ({ audioProDevice }) => {
  const onPauseClick = async () => {
    await triggerFlow(AUDIO_PRO_PAUSE_FLOW_ID);
  };

  const onPLayMusic = async () => {
    await triggerFlow(AUDIO_PRO_PLAY_MUSIC_FLOW_ID);
  };
  const onPlayRyddetid = async () => {
    await triggerFlow(AUDIO_PRO_PLAY_RYDDETID_FLOW_ID);
  };
  const onPlaySlowMusic = async () => {
    await triggerFlow(AUDIO_PRO_PLAY_SLOW_MUSIC_FLOW_ID);
  };
  const onPlayDanceClassics = async () => {
    await triggerFlow(AUDIO_PRO_PLAY_DANCE_CLASSICS_FLOW_ID);
  };

  return (
    <div className="entrance-focused-container">
      <div>
        <img
          className="audioopro-focused-icon-image"
          src={`https://my.homey.app/img/devices/${audioProDevice.iconOverride}.svg`}
        />
      </div>
      <div className="audiopro-focused-content">
        <SlButton
          size="large"
          className="audiopro-focused-buttton"
          onClick={onPauseClick}
        >
          Stopp avspilling
        </SlButton>
        <SlButton
          size="large"
          className="audiopro-focused-buttton"
          onClick={onPLayMusic}
        >
          Sett på musikk
        </SlButton>
        <SlButton
          size="large"
          className="audiopro-focused-buttton"
          onClick={onPlayRyddetid}
        >
          Spill ryddetid
        </SlButton>
        <SlButton
          size="large"
          className="audiopro-focused-buttton"
          onClick={onPlaySlowMusic}
        >
          Spill rolig musikk
        </SlButton>
        <SlButton
          size="large"
          className="audiopro-focused-buttton"
          onClick={onPlayDanceClassics}
        >
          Spill dance klassikere
        </SlButton>
      </div>
    </div>
  );
};
