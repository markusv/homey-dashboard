import React from "react";
import "./weather.css";
import { ForecastDay } from "./components/ForecastDay";
import { useFetchForecast } from "./helpers/useFetchForecast";
import { FocusedElement } from "../Focus/FocusedElement/FocusedElement";
import { WeatherLarge } from "./WeatherLarge";

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
            <WeatherLarge forecast={forecast} />
          </FocusedElement>
        );
      },
    });
  };

  return (
    <div onClick={onWeatherClick} className={className}>
      {forecast &&
        [0, 1, 2, 3, 4].map((dayOffset) => (
          <ForecastDay
            key={dayOffset}
            forecast={forecast}
            dayOfset={dayOffset}
          />
        ))}
    </div>
  );
};
