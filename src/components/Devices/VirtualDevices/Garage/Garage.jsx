import React from "react";
import { useGetDevice } from "../../helpers/useGetDevice";
import { getHomey } from "../../../../helpers/getHomey";
import { StatusIndicator } from "../../components/StatusIndicator/StatusIndicator";
import { SvgIcon } from "../../components/SvgIcon";
import { useMakeCapabilityInstance } from "../../helpers/useMakeCapabilityInstance";
import {
  GARAGE_OPENER_ID,
  GARAGE_SENSOR_DEVICE_ID,
} from "../../../../constants";

export const Garage = () => {
  const [garageSensorDevice, setGarageSensorDevice] = useGetDevice(
    GARAGE_SENSOR_DEVICE_ID
  );
  const [garageOpenerDevice] = useGetDevice(GARAGE_OPENER_ID);

  useMakeCapabilityInstance(
    garageSensorDevice,
    setGarageSensorDevice,
    "alarm_contact"
  );

  const onDeviceClick = async () => {
    const homeyApi = await getHomey();
    homeyApi.devices
      .setCapabilityValue({
        deviceId: garageOpenerDevice.id,
        capabilityId: "onoff.output1",
        value: true,
      })
      .catch(console.error);
  };

  const isOpen =
    garageSensorDevice?.capabilitiesObj?.["alarm_contact"]?.value ?? false;

  return (
    <div className="device" onClick={onDeviceClick}>
      <SvgIcon url="https://my.homey.app/img/devices/garage-door.svg" />
      {isOpen && <StatusIndicator />}
      <div className="device-content">Garasje port</div>
    </div>
  );
};
