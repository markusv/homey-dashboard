import React from "react";
import { useGetDevice } from "../helpers/useGetDevice";
import { ROBOROCK_STUE_DEVICE_ID } from "../../../constants";
import { Icon } from "../components/Icon";
import { getHomey } from "../../../helpers/getHomey";
import {
  ROBOROCK_ONOFF_CAPABILITY_ID,
  ROBOROCK_STATE_CAPABILITY_ID,
} from "./constants";
import { useMakeCapabilityInstance } from "../helpers/useMakeCapabilityInstance";

export const Roborock = () => {
  const [roborockDevice, setRoborockDevicee] = useGetDevice(
    ROBOROCK_STUE_DEVICE_ID
  );
  useMakeCapabilityInstance(
    roborockDevice,
    setRoborockDevicee,
    ROBOROCK_ONOFF_CAPABILITY_ID
  );
  useMakeCapabilityInstance(
    roborockDevice,
    setRoborockDevicee,
    ROBOROCK_STATE_CAPABILITY_ID
  );

  const onDeviceClick = async () => {
    const homeyApi = await getHomey();
    const currentValue =
      roborockDevice?.capabilitiesObj?.[ROBOROCK_ONOFF_CAPABILITY_ID]?.value ??
      false;
    const newValue = !currentValue;
    homeyApi.devices
      .setCapabilityValue({
        deviceId: roborockDevice.id,
        capabilityId: ROBOROCK_ONOFF_CAPABILITY_ID,
        value: newValue,
      })
      .catch(console.error);

    if (!newValue) {
      homeyApi.devices
        .setCapabilityValue({
          deviceId: roborockDevice.id,
          capabilityId: ROBOROCK_STATE_CAPABILITY_ID,
          value: "docked",
        })
        .catch(console.error);
    }
  };

  return (
    <div className="device" onClick={onDeviceClick}>
      <Icon homeyDevice={roborockDevice} />
      <div className="device-content">Roborock</div>
    </div>
  );
};
