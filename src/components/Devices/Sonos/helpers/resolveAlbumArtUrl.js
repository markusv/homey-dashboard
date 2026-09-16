const HOMEY_LOCAL_ORIGIN = "https://192-168-68-80.homey.homeylocal.com";

export const resolveAlbumArtUrl = (imageUrl, cacheKey) => {
  if (!imageUrl) return null;
  const resolved = /^https?:\/\//i.test(imageUrl)
    ? imageUrl
    : `${HOMEY_LOCAL_ORIGIN}${imageUrl}`;
  if (cacheKey === undefined || cacheKey === null || cacheKey === "") {
    return resolved;
  }
  const join = resolved.includes("?") ? "&" : "?";
  return `${resolved}${join}ts=${encodeURIComponent(String(cacheKey))}`;
};
