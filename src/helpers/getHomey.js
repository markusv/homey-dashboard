import { HomeyAPI } from "homey-api";

/** Browser-friendly Homey Local API (HTTPS, CORS-safe). */
const DEFAULT_HOMEY_ADDRESS = "https://192-168-68-80.homey.homeylocal.com";

let homeyApiPromise = null;

const getHomeyAddress = () =>
  import.meta.env.VITE_HOMEY_ADDRESS ??
  import.meta.env.REACT_APP_HOMEY_ADDRESS ??
  DEFAULT_HOMEY_ADDRESS;

const getHomeyToken = () =>
  import.meta.env.VITE_HOMEY_TOKEN ??
  import.meta.env.REACT_APP_HOMEY_TOKEN ??
  "";

export const getHomey = async () => {
  if (homeyApiPromise) {
    try {
      return await homeyApiPromise;
    } catch {
      homeyApiPromise = null;
    }
  }

  homeyApiPromise = getHomeyAsync().catch((error) => {
    homeyApiPromise = null;
    throw error;
  });

  return homeyApiPromise;
};

export const getHomeyAsync = async () => {
  const token = getHomeyToken();
  if (!token) {
    throw new Error(
      "Missing VITE_HOMEY_TOKEN or REACT_APP_HOMEY_TOKEN in .env — restart npm start after adding it"
    );
  }

  const homeyApi = await HomeyAPI.createLocalAPI({
    address: getHomeyAddress(),
    token,
  });
  return homeyApi;
};
