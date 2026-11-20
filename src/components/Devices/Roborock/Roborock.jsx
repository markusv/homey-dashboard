import React from "react";
import { FocusedElement } from "../../Focus/FocusedElement/FocusedElement";
import { RoborockFocus } from "./RoborockFocus";
import { VacuumIcon } from "./VacuumIcon/VacuumIcon";
import "../device.css";

export const Roborock = ({ onClick }) => {
  const onDeviceClick = async () => {
    if (onClick) {
      onClick({
        id: "roborockFocused",
        render: (close) => {
          return (
            <FocusedElement
              className="roborock-focus"
              title="Roborock"
              onCloseClick={close}
            >
              <RoborockFocus />
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
