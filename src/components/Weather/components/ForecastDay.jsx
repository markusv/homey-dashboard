import { getForecastForHour } from "../helpers/getForecastForHour";
import { getMinMaxTempForDay } from "../helpers/getMinMaxTempForDay";
import { getNameOfDay } from "../helpers/getNameOfDay";
import { getNameOfMonth } from "../helpers/getNameOfMonth";
import { TemperatureRange } from "../../Focus/components/Temperature/TemperatureRange";
import React from "react";
import { ForecastItem } from "./ForecastItem";

export const ForecastDay = ({ forecast, dayOfset }) => {
  const dateForForecast = new Date();
  dateForForecast.setDate(dateForForecast.getDate() + dayOfset);
  const forecastForDay = forecast.filter(
    (f) => new Date(f.time).getDate() === dateForForecast.getDate()
  );
  if (!forecastForDay || forecastForDay.length === 0) {
    return null;
  }

  const forecastNight = getForecastForHour(1, forecastForDay);
  const forecastMorning = getForecastForHour(7, forecastForDay);
  const forecastNoon = getForecastForHour(13, forecastForDay);
  const forecastEvening = getForecastForHour(19, forecastForDay);
  const forecastLateEvening = getForecastForHour(23, forecastForDay);
  const { min, max } = getMinMaxTempForDay(forecastForDay);
  const day = dateForForecast.getDate().toString().padStart(2, "0");
  return (
    <div className="forecast-for-day">
      <div className="forecast-day-name">
        {`${getNameOfDay(dateForForecast)} ${day} ${getNameOfMonth(
          dateForForecast
        )}`}{" "}
      </div>
      <div className="forecast-max-min-temp">
        <TemperatureRange
          temperatureOneAsInt={Math.round(max)}
          temperatureTwoAsInt={Math.round(min)}
        />
      </div>
      <div className="forecast">
        <ForecastItem forecast={forecastNight} />
        <ForecastItem forecast={forecastMorning} />
        <ForecastItem forecast={forecastNoon} />
        <ForecastItem forecast={forecastEvening || forecastLateEvening} />
      </div>
    </div>
  );
};
