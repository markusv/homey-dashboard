import React from "react";
import "./entranceDoor.css";
import { SlButton } from "@shoelace-style/shoelace/dist/react";
import { triggerFlow } from "../../../Flows/helpers/triggerFlow";

export const EntranceDoorFocus = ({ doorLockDevice }) => {
  const onAlwaysOpenClick = async () => {
    await triggerFlow("54c1dff2-cfed-49ee-9c8a-7f4779eb55cb");
  };

  const onAlwaysCloseClick = async () => {
    await triggerFlow("7f55fedc-c839-4dbf-b9ae-4212ef4f6394");
  };

  // TODO Find out how to update this
  //const isLockedAutomatically = doorLockDevice?.settings.auto_relock_time;

  return (
    <div className="entrance-focused-container">
      <img
        className="entrance-focused-icon-image"
        src="https://my.homey.app/img/devices/door.svg"
      />
      <div className="entrance-focused-content">
        <div className="entrance-focused-text">
          {/*isLockedAutomatically && <o>Døren låses automatisk</o>*/}
          {/*!isLockedAutomatically && <o>Døren er alltid åpen nå</o>*/}
        </div>
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
