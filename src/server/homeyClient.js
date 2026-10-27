import { HomeyAPI } from "homey-api";

export const HOMEY_ADDRESS =
  process.env.HOMEY_ADDRESS || "http://192.168.68.80";

const MISSING_TOKEN_ERROR =
  "Missing HOMEY_TOKEN / VITE_HOMEY_TOKEN / REACT_APP_HOMEY_TOKEN";

let homeyApiPromise = null;

const readHomeyToken = () =>
  process.env.HOMEY_TOKEN ||
  process.env.VITE_HOMEY_TOKEN ||
  process.env.REACT_APP_HOMEY_TOKEN ||
  "";

export const fetchHomeyPath = async (resource) => {
  const token = readHomeyToken();
  if (!token) {
    throw new Error(MISSING_TOKEN_ERROR);
  }

  const url = /^https?:\/\//i.test(resource)
    ? resource
    : `${HOMEY_ADDRESS}${resource.startsWith("/") ? resource : `/${resource}`}`;

  return fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getHomey = async () => {
  if (homeyApiPromise) return homeyApiPromise;

  const token = readHomeyToken();

  if (!token) {
    throw new Error(MISSING_TOKEN_ERROR);
  }

  homeyApiPromise = HomeyAPI.createLocalAPI({
    address: HOMEY_ADDRESS,
    token,
  });

  return homeyApiPromise;
};
