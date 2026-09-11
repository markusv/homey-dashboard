import React from "react";
import "./Entre.css";
import { Dashboard } from "./components/Dashboard";
import { useFetchForecast } from "../../components/Weather/helpers/useFetchForecast";
import { WeatherLarge } from "../../components/Weather/WeatherLarge";
import { DeparturesBoard } from "../../components/Departures/DeparturesBoard/DeparturesBoard";
import { USE_ENTUR_DEPARTURES, RUTER_MONITOR_URL } from "./constants";
import { useGetDevice } from "../../components/Devices/helpers/useGetDevice";
import { ETG_2_HEATPUMP_ID } from "../../constants";
import { useMakeCapabilityInstance } from "../../components/Devices/helpers/useMakeCapabilityInstance";
import { Temperature } from "../../components/Focus/components/Temperature/Temperature";
import { useSetDocumentTitle } from "../../helpers/useSetDocumentTitle";
import { useGetDevices } from "../../helpers/useGetDevices";
import { useGetFlows } from "../../helpers/useGetFlows";

export const Entre = () => {
  const [devices] = useGetDevices();
  useSetDocumentTitle("Dahboard Risløkkveien 66c - Stue");
  const [flows] = useGetFlows();
  const [forecast] = useFetchForecast();
  useSetDocumentTitle("Dahboard Risløkkveien 66c - Entre");

  const [heatPump, setHeatPump] = useGetDevice(ETG_2_HEATPUMP_ID);
  useMakeCapabilityInstance(
    heatPump,
    setHeatPump,
    "measure_temperature.outdoorTemperature"
  );

  if (!flows || !devices) {
    return null;
  }

  const outsideTemp =
    heatPump?.capabilitiesObj?.["measure_temperature.outdoorTemperature"]
      ?.value ?? "";
  return (
    <div className="entre-page sl-theme-dark homey-dashboard">
      <div className="entre-col-one">
        <div className="smart-home-container">
          <Dashboard />
        </div>
      </div>
      <div className="entre-col-two">
        <div
          className={`public-transport-container${
            USE_ENTUR_DEPARTURES ? " public-transport-container--entur" : ""
          }`}
        >
          {USE_ENTUR_DEPARTURES ? (
            <DeparturesBoard />
          ) : (
            <iframe
              title="Ruter"
              className="public-transport-frame"
              src={RUTER_MONITOR_URL}
            />
          )}
        </div>
        <div className="weather-container">
          {outsideTemp && (
            <h2 className="weather-container--current-temp">
              Utetempperatur: &nbsp;
              <Temperature ttemperatureAsInt={outsideTemp} />
              &nbsp;°C
            </h2>
          )}
          <WeatherLarge forecast={forecast} />
        </div>
      </div>
    </div>
  );
};
