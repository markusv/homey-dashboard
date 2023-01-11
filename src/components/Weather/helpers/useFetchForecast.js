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
    const callEveryDay = () => {
      intervalId = setInterval(getw, 1000 * 60 * 60 * 24);
    };

    getw();
    callEveryDay();
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return [forecast];
};
