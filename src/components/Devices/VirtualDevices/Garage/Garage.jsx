import React from "react";
import { useGetDevice } from "../helpers/useGetDevice";
import { Icon } from "../components/Icon";

const GARAGE_SENSOR_DEVICE_ID = "2b70d623-c675-4672-b2b8-715b9dd0f2ce";
const GARAGE_OPENER_ID = "5e80d371-9b3d-4117-8f96-c5068830a88d";

export const Garage = () => {
  const [garageSensorDevice] = useGetDevice(GARAGE_SENSOR_DEVICE_ID);
  const [garageOpenerDevice] = useGetDevice(GARAGE_OPENER_ID);
  console.log("garageOpenerDevice", garageOpenerDevice);
  return (
    <div className="device">
      <div className="device-icon">
        <img
          className="device-icon-image"
          src="https://my.homey.app/img/devices/garage-door.svg"
        />
      </div>
      Garasje
    </div>
  );
};
