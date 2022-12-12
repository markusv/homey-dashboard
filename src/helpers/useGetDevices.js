import { useEffect, useState } from "react";
import { getHomey } from "./getHomey";

export const useGetDevices = () => {
  const [devices, setDevices] = useState();
  useEffect(() => {
    const getDevices = async () => {
      const homeyApi = await getHomey();
      if (homeyApi) {
        setDevices(await homeyApi.devices.getDevices());
      }
    };
    getDevices();
  }, []);
  return [devices];
};
