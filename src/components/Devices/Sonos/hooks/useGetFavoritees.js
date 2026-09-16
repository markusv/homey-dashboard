import { useEffect, useState } from "react";
import { getHomey } from "../../../../helpers/getHomey";

export const useGetFavoritees = (deviceId) => {
  const [loading, setLoading] = useState(Boolean(deviceId));
  const [favorites, setFavorites] = useState([]);
  useEffect(() => {
    if (!deviceId) {
      setLoading(false);
      setFavorites([]);
      return undefined;
    }

    let cancelled = false;
    const getF = async () => {
      try {
        const homeyApi = await getHomey();
        const f = await homeyApi.flow.getFlowCardAutocomplete({
          uri: "homey:manager:flow",
          id: `homey:device:${deviceId}:cloud_play_sonos_favorite`,
          name: "favorite",
          query: "",
          type: "flowcardaction",
        });
        if (cancelled) return;
        setFavorites(f ?? []);
        setLoading(false);
      } catch {
        if (cancelled) return;
        setFavorites([]);
        setLoading(false);
      }
    };
    setLoading(true);
    getF();
    return () => {
      cancelled = true;
    };
  }, [deviceId]);
  return { loading, favorites };
};
