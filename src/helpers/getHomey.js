import { HomeyAPI } from "homey-api";
let homeyApiPromise = null;

export const getHomey = async () => {
  if (homeyApiPromise) {
    return homeyApiPromise;
  }
  homeyApiPromise = getHomeyAsync();
  return await homeyApiPromise;
};

export const getHomeyAsync = async () => {
  const homeyApi = await HomeyAPI.createLocalAPI({
    address: "http://192.168.68.86",
    token: process.env.REACT_APP_HOMEY_TOKEN ?? "",
  });
  return homeyApi;
};
