import { HomeyAPI } from "homey-api";

export const HOMEY_ADDRESS =
  process.env.HOMEY_ADDRESS || "http://192.168.68.80";

let homeyApiPromise = null;

export const getHomey = async () => {
  if (homeyApiPromise) return homeyApiPromise;

  const token =
    process.env.HOMEY_TOKEN ||
    process.env.VITE_HOMEY_TOKEN ||
    process.env.REACT_APP_HOMEY_TOKEN ||
    "";

  if (!token) {
    throw new Error(
      "Missing HOMEY_TOKEN / VITE_HOMEY_TOKEN / REACT_APP_HOMEY_TOKEN"
    );
  }

  homeyApiPromise = HomeyAPI.createLocalAPI({
    address: HOMEY_ADDRESS,
    token,
  });

  return homeyApiPromise;
};
