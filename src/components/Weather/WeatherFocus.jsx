import React from "react";
import { ForecastDay } from "./components/ForecastDay";

export const WeatherFocus = ({ forecast }) => {
  return (
    <div className="weather-focus">
      <ForecastDay forecast={forecast} dayOfset={0} />
      <ForecastDay forecast={forecast} dayOfset={1} />
      <ForecastDay forecast={forecast} dayOfset={2} />
      <ForecastDay forecast={forecast} dayOfset={3} />
      <ForecastDay forecast={forecast} dayOfset={4} />
      <ForecastDay forecast={forecast} dayOfset={5} />
      <ForecastDay forecast={forecast} dayOfset={6} />
      <ForecastDay forecast={forecast} dayOfset={7} />
    </div>
  );
};
