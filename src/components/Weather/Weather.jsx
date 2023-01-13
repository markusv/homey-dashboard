import React from "react";
import "./weather.css";
import { ForecastDay } from "./components/ForecastDay";
import { useFetchForecast } from "./helpers/useFetchForecast";
import { FocusedElement } from "../Focus/FocusedElement/FocusedElement";
import { WeatherFocus } from "./WeatherFocus";

export const Weather = ({ onSetFocus, className }) => {
  const [forecast] = useFetchForecast();

  const onWeatherClick = () => {
    onSetFocus({
      id: "weatherForecast",
      render: (close) => {
        return (
          <FocusedElement
            title="Været"
            onCloseClick={close}
            className="focused-weather-container"
          >
            <WeatherFocus forecast={forecast} />
          </FocusedElement>
        );
      },
    });
  };

  return (
    <div onClick={onWeatherClick} className={className}>
      {forecast && (
        <>
          <ForecastDay forecast={forecast} dayOfset={0} />
          <ForecastDay forecast={forecast} dayOfset={1} />
          <ForecastDay forecast={forecast} dayOfset={2} />
        </>
      )}
    </div>
  );
};
