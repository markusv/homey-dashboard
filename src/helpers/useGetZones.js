import { useEffect, useState } from "react";
import { getHomey } from "./getHomey";

export const useGetZones = () => {
  const [zones, setZones] = useState();
  useEffect(() => {
    const getZones = async () => {
      try {
        const homeyApi = await getHomey();
        if (homeyApi) {
          setZones(await homeyApi.zones.getZones());
        }
      } catch (error) {
        console.error("error in useGetZones:", error);
      }
    };
    getZones();
  }, []);
  return [zones];
};
