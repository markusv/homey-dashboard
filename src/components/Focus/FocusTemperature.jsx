import React from "react";
import { ReactComponent as ThermometerIcon } from "../../img/thermometer-svgrepo-com.svg";
import { TemperatureRange } from "./components/Temperature/TemperatureRange";
import { useGetDevice } from "../Devices/helpers/useGetDevice";
import { HEATPUMP_DEVICE_ID } from "./constants";
import { useMakeCapabilityInstance } from "../Devices/helpers/useMakeCapabilityInstance";
import "./focusTemperature.css";

export const FocusTemperature = () => {
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
    <div className="focus-temperature">
      <h3>Temperatur</h3>
      <div className="focus-temperature-content">
        <ThermometerIcon className="focus-temperature-icon" />
        <div>
          <div className="temperature">Inne / Ute</div>
          <div>
            <TemperatureRange
              className="focus-temperature-ramge"
              temperatureOneAsInt={temperature}
              temperatureTwoAsInt={outdoorTemperature}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
