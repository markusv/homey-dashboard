import { useEffect, useState } from "react";
import { getHomey } from "../../../../helpers/getHomey";

export const useGetFavoritees = (deviceId) => {
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  useEffect(() => {
    const getF = async () => {
      const homeyApi = await getHomey();
      const f = await homeyApi.flow.getFlowCardAutocomplete({
        uri: "homey:manager:flow",
        id: `homey:device:${deviceId}:cloud_play_sonos_favorite`,
        name: "favorite",
        query: "",
        type: "flowcardaction",
      });
      setFavorites(f);
      setLoading(false);
    };
    getF();
  }, []);
  return { loading, favorites };
};
