import React from "react";
import { useGetDevice } from "../helpers/useGetDevice";
import { ROBOROCK_STUE_DEVICE_ID } from "../../../constants";
import { Icon } from "../components/Icon";
import { useToggleRoborockClean } from "./useToggleRoborockClean";
import { FocusedElement } from "../../Focus/FocusedElement/FocusedElement";
import { RoborockFocus } from "./RoborockFocus";

export const Roborock = ({ onClick }) => {
  const [roborockDevice, setRoborockDevice] = useGetDevice(
    ROBOROCK_STUE_DEVICE_ID
  );

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
      <Icon homeyDevice={roborockDevice} />
      <div className="device-content">Roborock</div>
    </div>
  );
};
