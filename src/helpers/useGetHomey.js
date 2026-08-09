import { useEffect, useState } from "react";
import AthomCloudAPI from "homey-api/lib/AthomCloudAPI";
import config from "../config";

const getHomey = async () => {
  const api = new AthomCloudAPI({
    clientId: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
  });

  const params = new URLSearchParams(document.location.search);
  let token = params.get("token");
  try {
    token = atob(token);
  } catch {
    throw new Error("Token invalid. Please log-in again");
  }
  token = JSON.parse(token);
  api.setToken(token);
  const isLoggedIn = await api.isLoggedIn();
  if (!isLoggedIn) {
    throw new Error("Token Expired. Please log-in again");
  }
  const authenticatedUser = await api.getAuthenticatedUser();
  const firstHomey = await authenticatedUser.getFirstHomey();
  const homey = await firstHomey.authenticate();
  return homey;
};

export const useGetHomey = () => {
  const [homey, setHomey] = useState(null);
  useEffect(() => {
    const fetchHomey = async () => {
      setHomey(await getHomey());
    };
    fetchHomey();
  }, []);
  return [homey];
};
