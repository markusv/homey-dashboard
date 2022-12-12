import { useEffect, useState } from "react";
import { getHomey } from './getHomey'

const getFavorites = async () => {
  const homeyApi = await getHomey()
  const me = await homeyApi.users.getUserMe();
  return {
    favoriteDevices: me.properties?.favoriteDevices ?? [],
    favoriteFlows: me.properties?.favoriteFlows ?? []
  }
}

export const useGetFavoriteIds = () => {
  const [favoriteDevices, setFavoriteDevies] = useState();
  const [favoriteFlows, setFavoriteFlows] = useState();
  useEffect(() => {
    async function getF() {
      const favorites = await getFavorites();
      setFavoriteDevies(favorites.favoriteDevices)
      setFavoriteFlows(favorites.favoriteFlows)
    }
    getF()
  }, [])
  return [favoriteDevices, favoriteFlows]
}