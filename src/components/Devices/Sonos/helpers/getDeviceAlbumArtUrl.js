import { getImageUrl } from "./getImageUrl";
import { resolveAlbumArtUrl } from "./resolveAlbumArtUrl";

/** Same album-art URL the Stue speaker list and player both render. */
export const getDeviceAlbumArtUrl = (device, track) => {
  const trackName = typeof track === "string" ? track.trim() : "";
  if (!trackName) return null;
  return resolveAlbumArtUrl(getImageUrl(device), trackName);
};
