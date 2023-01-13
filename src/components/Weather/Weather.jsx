import React from "react";
import "./weather.css";
import { ForecastDay } from "./components/ForecastDay";
import { useFetchForecast } from "./helpers/useFetchForecast";

export const Weather = ({ className }) => {
  const [forecast] = useFetchForecast();
  return (
    <div className={className}>
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
