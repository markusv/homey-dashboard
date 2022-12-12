import { useEffect, useState } from "react";

const getFavorites = async (homey) => {
  const me = await homey.users.getUserMe();
  return {
    favoriteDevices: me.properties?.favoriteDevices ?? [],
    favoriteFlows: me.properties?.favoriteFlows ?? []
  }
}

export const useGetFavorites = (homey) => {
  const [favoriteDevices, setFavoriteDevies] = useState();
  const [favoriteFlows, setFavoriteFlows] = useState();
  useEffect(() => {
    async function getF() {
      const favorites = await getFavorites(homey);
      setFavoriteDevies(favorites.favoriteDevices)
      setFavoriteFlows(favorites.favoriteFlows)
    }
    if (homey) {
      getF()
    }
  }, [homey])
  return [favoriteDevices, favoriteFlows]
}