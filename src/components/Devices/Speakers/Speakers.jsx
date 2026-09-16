import { Icon } from "../components/Icon";
import React from "react";
import { getMusicSpeakers } from "./Speakers.helpers";
import { SpeakersFocus } from "./SpeakersFocus";
import "./speakers.css";

export const Speakers = ({ onClick, devices }) => {
  const speakers = getMusicSpeakers(devices);
  const tileDevice = speakers[0];

  const onDeviceClick = () => {
    if (!onClick) return;
    onClick(
      {
        id: "speakers",
        render: (close) => {
          return <SpeakersFocus close={close} devices={devices} />;
        },
      },
      false
    );
  };

  return (
    <div className="device" onClick={onDeviceClick}>
      <Icon homeyDevice={tileDevice} />
      <div className="device-content">Høyttalere</div>
    </div>
  );
};
