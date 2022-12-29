import React from "react";
import { useGetDevice } from "../helpers/useGetDevice";
import { Icon } from "../components/Icon";
import { FocusedElement } from "../../Focus/FocusedElement/FocusedElement";
import { AudioProSpeakerFocus } from "./AudioProSpeakerFocus";

const AUDIO_PRO_DEVICE_ID = "06d71bbf-5c0b-4aa6-a96a-cce4301fe916";

export const AudioProSpeaker = ({ onClick }) => {
  const [audioProDevice] = useGetDevice(AUDIO_PRO_DEVICE_ID);

  const onDeviceClick = async () => {
    if (onClick) {
      onClick({
        id: "audioProSpeaker",
        render: (close) => {
          return (
            <FocusedElement title="AudioPro høyttaler" onCloseClick={close}>
              <AudioProSpeakerFocus audioProDevice={audioProDevice} />
            </FocusedElement>
          );
        },
      });
    }
  };

  return (
    <div className="device" onClick={onDeviceClick}>
      <Icon homeyDevice={audioProDevice} />
      <div className="device-content">Høyttaler</div>
    </div>
  );
};
