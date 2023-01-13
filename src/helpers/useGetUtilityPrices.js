import { useEffect, useState } from "react";
import { getHomey } from "./getHomey";

const calculateSecondsToNextHour = () => {
  const nextDate = new Date();
  nextDate.setHours(nextDate.getHours() + 1);
  nextDate.setMinutes(1);
  nextDate.setSeconds(0);
  return nextDate - new Date();
};

const getPrices = async () => {
  const homeyApi = await getHomey();
  if (!homeyApi) {
    return;
  }
  const result = await homeyApi.flow.runFlowCardAction({
    uri: "homey:device:4a169eb8-df56-4657-8c1c-5d147803806d",
    id: "fetch_prices",
    args: [],
  });
  return JSON.parse(result?.returnTokens?.prices ?? "[]");
};

export const useGetUtilityPrices = () => {
  const [utilityPrices, setUtilityPrices] = useState();

  useEffect(() => {
    let intervalId;
    const setPrices = async () => {
      setUtilityPrices(await getPrices());
    };
    const callEveryHour = () => {
      intervalId = setInterval(setPrices, 1000 * 60 * 60);
    };

    if (new Date().getMinutes() === 0) callEveryHour();
    else {
      intervalId = setTimeout(callEveryHour, calculateSecondsToNextHour());
    }

    setPrices();
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);
  return [utilityPrices];
};
