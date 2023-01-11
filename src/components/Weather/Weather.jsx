import React, { useEffect, useState } from "react";
import "./weather.css";
import { ForecastDay } from "./components/ForecastDay";
import { useFetchForecast } from "./helpers/useFetchForecast";

export const Weather = ({ className }) => {
  const [forecast] = useFetchForecast();
  const [time, setTime] = useState(Date.now());
  useEffect(() => {
    let intervalId;
    const callEveryThirdHour = () => {
      intervalId = setInterval(() => {
        setTime(Date.now());
      }, 1000 * 60 * 60 * 3);
    };
    callEveryThirdHour();
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

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
