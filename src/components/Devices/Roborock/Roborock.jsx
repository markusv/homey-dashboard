import React from "react";
import { useGetDevice } from "../helpers/useGetDevice";
import { ROBOROCK_STUE_DEVICE_ID } from "../../../constants";
import { FocusedElement } from "../../Focus/FocusedElement/FocusedElement";
import { RoborockFocus } from "./RoborockFocus";
import { VacuumIcon } from "./VacuumIcon";
import "../device.css";

export const Roborock = ({ onClick }) => {
  const [roborockDevice] = useGetDevice(ROBOROCK_STUE_DEVICE_ID);

  const onDeviceClick = async () => {
    if (onClick) {
      onClick({
        id: "roborockFocused",
        render: (close) => {
          return (
            <FocusedElement title="Velg rom å rengjøre:" onCloseClick={close}>
              <RoborockFocus roborockDevice={roborockDevice} />
            </FocusedElement>
          );
        },
      });
    }
  };

  return (
    <div className="device" onClick={onDeviceClick}>
      <div className="device-icon device-icon--glyph">
        <VacuumIcon className="device-vacuum-icon" />
      </div>
      <div className="device-content">Roborock</div>
    </div>
  );
};
