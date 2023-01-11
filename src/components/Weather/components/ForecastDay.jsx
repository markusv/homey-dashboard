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

  const forecastMorning = getForecastForHour(6, forecastForDay);
  const forecastNoon = getForecastForHour(12, forecastForDay);
  const forecastAfternoon = getForecastForHour(18, forecastForDay);
  const forecastEvening = getForecastForHour(23, forecastForDay);
  const { min, max } = getMinMaxTempForDay(forecastForDay);
  const day = dateForForecast.getDate().toString().padStart(2, "0");
  return (
    <div className="forecast-for-day">
      <div>
        {`${getNameOfDay(dateForForecast)} ${day} ${getNameOfMonth(
          dateForForecast
        )}`}{" "}
        <TemperatureRange
          temperatureOneAsInt={Math.round(max)}
          temperatureTwoAsInt={Math.round(min)}
        />
      </div>
      <div className="forecast">
        <ForecastItem forecast={forecastMorning} />
        <ForecastItem forecast={forecastNoon} />
        <ForecastItem forecast={forecastAfternoon} />
        <ForecastItem forecast={forecastEvening} />
      </div>
    </div>
  );
};
