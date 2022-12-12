import React from "react";
import "./focus.css";
import { ReactComponent as ThermometerIcon } from "../../img/thermometer-svgrepo-com.svg";
import { useGetDevice } from "../Devices/helpers/useGetDevice";
import { useMakeCapabilityInstance } from "../Devices/helpers/useMakeCapabilityInstance";

const HEATPUMP_DEVICE_ID = "aacca427-1cae-4d20-abd9-13e1e8bcda04";

export const Focus = () => {
  const [heatPumpDevice, setHeatPumpDevice] = useGetDevice(HEATPUMP_DEVICE_ID);
  useMakeCapabilityInstance(
    heatPumpDevice,
    setHeatPumpDevice,
    "measure_temperature"
  );
  useMakeCapabilityInstance(
    heatPumpDevice,
    setHeatPumpDevice,
    "measure_temperature.outdoorTemperature"
  );
  const temperature =
    heatPumpDevice?.capabilitiesObj?.["measure_temperature"]?.value ?? 0;
  const outdoorTemperature =
    heatPumpDevice?.capabilitiesObj?.["measure_temperature.outdoorTemperature"]
      ?.value ?? 0;

  return (
    <div className="focus-container">
      <div className="focus-temperature">
        <h3>Temperatur</h3>
        <div className="focus-icon-container">
          <ThermometerIcon className="focus-thermometer" />
        </div>
        <div>{`Inne temperatur er ${temperature}, ute temperatur er ${outdoorTemperature}`}</div>
      </div>
    </div>
  );
};
