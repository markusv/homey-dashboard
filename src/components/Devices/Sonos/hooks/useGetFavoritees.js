import { use } from "react";
import { getHomey } from "../../../../helpers/getHomey";

const favoritesByDeviceId = new Map();

const fetchSonosFavorites = async (deviceId) => {
  const homeyApi = await getHomey();
  const favorites = await homeyApi.flow.getFlowCardAutocomplete({
    uri: "homey:manager:flow",
    id: `homey:device:${deviceId}:cloud_play_sonos_favorite`,
    name: "favorite",
    query: "",
    type: "flowcardaction",
  });
  return favorites ?? [];
};

export const getSonosFavoritesResource = (deviceId) => {
  if (!deviceId) return Promise.resolve([]);
  const cached = favoritesByDeviceId.get(deviceId);
  if (cached) return cached;
  const resource = fetchSonosFavorites(deviceId).catch(() => []);
  favoritesByDeviceId.set(deviceId, resource);
  return resource;
};

export const useGetFavoritees = (deviceId) => {
  const favorites = use(getSonosFavoritesResource(deviceId));
  return { favorites };
};
