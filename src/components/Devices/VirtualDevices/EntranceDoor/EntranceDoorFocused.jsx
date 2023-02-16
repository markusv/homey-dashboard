import React from "react";
import "./entranceDoor.css";
import { SlButton } from "@shoelace-style/shoelace/dist/react";
import { triggerFlow } from "../../../Flows/helpers/triggerFlow";
import { getHomey } from "../../../../helpers/getHomey";
import {
  ENTRANCE_DOOW_ALWAYS_CLOSED_FLOW_ID,
  ENTRANCE_DOOW_ALWAYS_OPEN_FLOW_ID,
} from "../../../../constants";

export const EntranceDoorFocused = ({ entranceDoorLockDevice }) => {
  const onAlwaysOpenClick = async () => {
    await triggerFlow(ENTRANCE_DOOW_ALWAYS_OPEN_FLOW_ID);
  };

  const onAlwaysCloseClick = async () => {
    await triggerFlow(ENTRANCE_DOOW_ALWAYS_CLOSED_FLOW_ID);
  };

  const onOpenClick = async () => {
    const homeyApi = await getHomey();
    homeyApi.devices
      .setCapabilityValue({
        deviceId: entranceDoorLockDevice.id,
        capabilityId: "locked",
        value: false,
      })
      .catch(console.error);
  };

  // TODO Find out how to update this
  //const isLockedAutomatically = entranceDoorLockDevice?.settings.auto_relock_time;

  return (
    <div className="entrance-focused-container">
      <div>
        <img
          className="entrance-focused-icon-image"
          src="https://my.homey.app/img/devices/door.svg"
        />
      </div>
      <div className="entrance-focused-content">
        <SlButton
          size="large"
          className="entrance-focused-buttton"
          onClick={onOpenClick}
        >
          Åpne døra
        </SlButton>
        <SlButton
          size="large"
          className="entrance-focused-buttton"
          onClick={onAlwaysOpenClick}
        >
          Sett alltid åpen
        </SlButton>
        <SlButton
          size="large"
          className="entrance-focused-buttton"
          onClick={onAlwaysCloseClick}
        >
          Sett alltid lukket
        </SlButton>
      </div>
    </div>
  );
};
