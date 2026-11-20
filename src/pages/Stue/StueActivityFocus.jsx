import React from "react";
import { FocusedElement } from "../../components/Focus/FocusedElement/FocusedElement";
import { RoborockFocus } from "../../components/Devices/Roborock/RoborockFocus";
import { SONOS_KITCHEN_ID } from "../../components/Devices/Sonos/Sonos";
import { SpeakersFocus } from "../../components/Devices/Speakers/SpeakersFocus";
import { STUE_ACTIVITY } from "./helpers/pickStueActivity";

export const StueActivityFocus = ({ activityId, devices, onClose }) => {
  if (activityId === STUE_ACTIVITY.ROBOROCK) {
    return (
      <FocusedElement
        className="roborock-focus"
        title="Roborock"
        onCloseClick={onClose}
      >
        <RoborockFocus />
      </FocusedElement>
    );
  }

  if (activityId === STUE_ACTIVITY.KITCHEN_SPEAKER) {
    return (
      <SpeakersFocus
        close={onClose}
        devices={devices}
        initialDeviceId={SONOS_KITCHEN_ID}
      />
    );
  }

  return null;
};
