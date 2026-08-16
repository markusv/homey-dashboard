import React from "react";
import classNames from "classnames";
import { useGetDevice } from "../../../components/Devices/helpers/useGetDevice";
import { triggerFlow } from "../../../components/Flows/helpers/triggerFlow";
import { SonosFocus } from "../../../components/Devices/Sonos/SonosFocus";
import { AudioProSpeakerFocus } from "../../../components/Devices/AudioProSpeaker/AudioProSpeakerFocus";
import { useActionLock } from "../helpers/useActionLock";
import "../../../components/Devices/Sonos/sonos.css";
import "../../../components/Devices/AudioProSpeaker/audiopro.css";

const SpeakerFlowButton = ({ flow }) => {
  const [run, pending] = useActionLock();

  return (
    <button
      type="button"
      className={classNames("andre-scene-button", {
        "andre-scene-button--pending": pending,
      })}
      aria-label={flow.label || "Handling"}
      disabled={pending}
      onClick={(event) => {
        run(() => triggerFlow(flow.id));
        event.currentTarget.blur();
      }}
    >
      <sl-icon name={flow.icon || "play-circle"} />
      <span className="andre-scene-button-label">
        {flow.label || "Handling"}
      </span>
    </button>
  );
};

export const SpeakerSection = ({ deviceId, flows = [] }) => {
  const [device] = useGetDevice(deviceId);
  if (!deviceId) return null;

  const isCapabilitySpeaker = device?.capabilities?.includes("speaker_playing");
  const hasFlows = flows.length > 0;

  return (
    <section
      className={classNames("andre-section", "andre-speaker-section", {
        "andre-speaker-section--player": isCapabilitySpeaker,
      })}
    >
      {!isCapabilitySpeaker && (
        <h2 className="andre-section-title">Høyttaler</h2>
      )}
      {!device && <div className="andre-temp-status">Laster høyttaler…</div>}
      {device && isCapabilitySpeaker && (
        <SonosFocus
          deviceId={deviceId}
          embedded
          sectionTitle="Høyttaler"
          title={device.name}
        />
      )}
      {device && !isCapabilitySpeaker && (
        <div className="andre-audiopro">
          <AudioProSpeakerFocus audioProDevice={device} />
        </div>
      )}
      {hasFlows && (
        <div className="andre-speaker-flows andre-flows">
          {flows.map((flow) => (
            <SpeakerFlowButton key={flow.id} flow={flow} />
          ))}
        </div>
      )}
    </section>
  );
};
