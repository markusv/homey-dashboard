import React from "react";
import { useGetDevice } from "../helpers/useGetDevice";
import { triggerFlow } from "../../Flows/helpers/triggerFlow";

const SCREEN_DEVICE_ID = "c0cd78c5-308d-44ff-b8d7-43a8c43f96fc";
const FLOW_ID = "5764ad59-1ce1-4f3c-b5f0-def0badb8853";

export const Rullegardiner = ({ onClick }) => {
  const [homeyDevice] = useGetDevice(SCREEN_DEVICE_ID);
  const onDeviceClick = async () => {
    await triggerFlow(FLOW_ID);
    if (onClick) {
      onClick("rullegardiner");
    }
  };

  if (!homeyDevice) {
    return null;
  }

  return (
    <div onClick={onDeviceClick} className="device">
      <div className="device-icon">
        {homeyDevice.iconObj && (
          <img
            className="device-icon-image"
            src={`https://icons-cdn.athom.com/${homeyDevice.iconObj.id}-128.png`}
          />
        )}
      </div>
      {homeyDevice.name}
    </div>
  );
};
