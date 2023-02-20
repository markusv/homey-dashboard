import React from "react";
import "./Entre.css";
import { Dashboard } from "./components/Dashboard";
import { useFetchForecast } from "../../components/Weather/helpers/useFetchForecast";
import { WeatherLarge } from "../../components/Weather/WeatherLarge";
import { useGetDevice } from "../../components/Devices/helpers/useGetDevice";
import { ENTRANCE_DOOR_SENSOR_ID } from "../../constants";
import { useMakeCapabilityInstance } from "../../components/Devices/helpers/useMakeCapabilityInstance";
import { Temperature } from "../../components/Focus/components/Temperature/Temperature";
import { useSetDocumentTitle } from "../../helpers/useSetDocumentTitle";

export const Entre = () => {
  const [forecast] = useFetchForecast();
  useSetDocumentTitle("Dahboard Risløkkveien 66c - Entre");
  const [entranceDoorSensorDevice, setEntranceDoorSensorDevice] = useGetDevice(
    ENTRANCE_DOOR_SENSOR_ID
  );
  useMakeCapabilityInstance(
    entranceDoorSensorDevice,
    setEntranceDoorSensorDevice,
    "measure_temperature"
  );
  const outsideTemp =
    entranceDoorSensorDevice?.capabilitiesObj?.["measure_temperature"]?.value ??
    "";
  return (
    <div className="entre-page sl-theme-dark homey-dashboard">
      <div className="entre-row-one">
        <div className="entre-left-col">
          <div className="smart-home-container">
            <Dashboard />
          </div>
        </div>
        <div className="entre-right-col">
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
      <div className="entre-row-two">
        <div className="public-transport-container">
          <iframe
            className="public-transport-frame"
            src="https://mon.ruter.no/departures/59.93371152573079-10.823993057232567/N4Igrgzgpgwg9gGzAWwHYBkCGBPOYAuIAXPgE5hQA0IARnJqQCYTEDaoE+cADgAoKYAxlACSzNiAByAZQBKRaVz4DhRAGwAmAMwAGABwgAutUZQB2KI0UN8AFQCWyKMR3UAFvcamM91FBZEoDLyijz8QlDq2voSwUQAimA46gAsOgC06ACMmfYICP5kAB-IRgC+1KgoNFCkAPIAZgAiUNw2YKT+xFrU+Pb4BcQgAIIIqJgABFwA5iAm9hCYNAWMtqSYqBDccKT4ALJwpgGstJBG1FDjy5bEZBTunlBrQgDW8Ehot+RQFRxK4cIxMcpHIFP8VJEAKwATg0GnOIFM5ks1l2DicLgeXku6F8XUCIJC4IiRBhcNioMSySy+jUWnSKXSADVCgh7HNCQkktgiDS9HT0pDmaz2dQ4lSeXyBUKWZw2RMAG72Sa2IoWVDlSrVWqNFptXYdfE9EB9AbOIggWQLBBFF4vFU0DbOeaLa6rdabba7A5HNjGECXJYrL73EAeUzPQRvRAoDUkb5lf0K2oQexwOMaMpAA"
          />
        </div>
      </div>
    </div>
  );
};
