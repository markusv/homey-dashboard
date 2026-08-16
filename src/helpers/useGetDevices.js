import { useEffect, useState } from "react";
import { getHomey } from "./getHomey";

export const useGetDevices = () => {
  const [devices, setDevices] = useState();
  useEffect(() => {
    const getDevices = async () => {
      try {
        const homeyApi = await getHomey();
        if (homeyApi) {
          setDevices(await homeyApi.devices.getDevices());
        }
      } catch (error) {
        console.error("error in useGetDevices:", error);
      }
    };
    getDevices();
  }, []);
  return [devices];
};
