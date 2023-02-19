import React from "react";
import { ForecastDay } from "./components/ForecastDay";

export const WeatherLarge = ({ forecast }) => {
  if (!forecast) {
    return null;
  }
  return (
    <div className="weather-large">
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
