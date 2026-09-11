import { useEffect, useState } from "react";
import { getDepartures } from "../helpers/getDepartures";

const POLL_MS = 20 * 1000;

export const useFetchDepartures = () => {
  const [departures, setDepartures] = useState();

  useEffect(() => {
    let intervalId;
    const refresh = async () => {
      const fetched = await getDepartures();
      if (fetched) {
        setDepartures(fetched);
      }
    };

    refresh();
    intervalId = setInterval(refresh, POLL_MS);
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return [departures];
};
