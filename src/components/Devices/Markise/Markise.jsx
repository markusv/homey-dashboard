import React from "react";
import { useGetDevice } from "../helpers/useGetDevice";
import { Icon } from "../components/Icon";
import { MARKISE_DEVICE_ID } from "../../../constants";
import { useMakeCapabilityInstance } from "../helpers/useMakeCapabilityInstance";
import { getHomey } from "../../../helpers/getHomey";
import { MARKISE_UP_DOWN_CAPABILITY_ID } from "./constants";

export const Markise = () => {
  const [markiseDevice, setMarkiseeDevice] = useGetDevice(MARKISE_DEVICE_ID);
  useMakeCapabilityInstance(
    markiseDevice,
    setMarkiseeDevice,
    MARKISE_UP_DOWN_CAPABILITY_ID
  );

  const onDeviceClick = async () => {
    const homeyApi = await getHomey();
    const currentValue =
      markiseDevice?.capabilitiesObj?.[MARKISE_UP_DOWN_CAPABILITY_ID]?.value ??
      0;
    homeyApi.devices
      .setCapabilityValue({
        deviceId: markiseDevice.id,
        capabilityId: MARKISE_UP_DOWN_CAPABILITY_ID,
        value: currentValue === 0 ? 1 : 0,
      })
      .catch(console.error);
  };

  return (
    <div className="device" onClick={onDeviceClick}>
      <Icon homeyDevice={markiseDevice} />
      <div className="device-content">Markise</div>
    </div>
  );
};
