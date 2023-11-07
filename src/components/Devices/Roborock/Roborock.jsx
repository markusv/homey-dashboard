import React from "react";
import { useGetDevice } from "../helpers/useGetDevice";
import { ROBOROCK_STUE_DEVICE_ID } from "../../../constants";
import { Icon } from "../components/Icon";
import { useToggleRoborockClean } from "./useToggleRoborockClean";

export const Roborock = () => {
  const [roborockDevice, setRoborockDevice] = useGetDevice(
    ROBOROCK_STUE_DEVICE_ID
  );
  const onToggleRoborockClean = useToggleRoborockClean(
    roborockDevice,
    setRoborockDevice
  );

  return (
    <div className="device" onClick={onToggleRoborockClean}>
      <Icon homeyDevice={roborockDevice} />
      <div className="device-content">Roborock</div>
    </div>
  );
};
