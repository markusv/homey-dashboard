import { useEffect, useState } from "react";
import { getWeather } from "./getWeather";

export const useFetchForecast = () => {
  const [forecast, setForecast] = useState();

  useEffect(() => {
    let intervalId;
    const getw = async () => {
      const fetchedWeather = await getWeather();
      setForecast(fetchedWeather);
    };
    const callEveryHour = () => {
      intervalId = setInterval(getw, 1000 * 60 * 60);
    };

    getw();
    callEveryHour();
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return [forecast];
};
