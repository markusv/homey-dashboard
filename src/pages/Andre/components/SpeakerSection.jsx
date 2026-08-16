import React from "react";
import { useGetDevice } from "../../../components/Devices/helpers/useGetDevice";
import { SonosFocus } from "../../../components/Devices/Sonos/SonosFocus";
import { AudioProSpeakerFocus } from "../../../components/Devices/AudioProSpeaker/AudioProSpeakerFocus";
import "../../../components/Devices/Sonos/sonos.css";
import "../../../components/Devices/AudioProSpeaker/audiopro.css";

export const SpeakerSection = ({ deviceId }) => {
  const [device] = useGetDevice(deviceId);
  if (!deviceId) return null;

  const isCapabilitySpeaker = device?.capabilities?.includes("speaker_playing");

  return (
    <section className="andre-section andre-speaker-section">
      <h2 className="andre-section-title">Høyttaler</h2>
      {!device && <div className="andre-temp-status">Laster høyttaler…</div>}
      {device && isCapabilitySpeaker && (
        <SonosFocus deviceId={deviceId} embedded title={device.name} />
      )}
      {device && !isCapabilitySpeaker && (
        <div className="andre-audiopro">
          <AudioProSpeakerFocus audioProDevice={device} />
        </div>
      )}
    </section>
  );
};
