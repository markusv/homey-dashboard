import { useEffect, useRef, useState } from "react";
import { getImageUrl } from "../helpers/getImageUrl";

const HOMEY_LOCAL_ORIGIN = "https://192-168-68-80.homey.homeylocal.com";

const resolveAlbumArtUrl = (imageUrl) => {
  if (!imageUrl) return null;
  const cacheBust = `ts=${Date.now()}`;
  if (/^https?:\/\//i.test(imageUrl)) {
    return `${imageUrl}${imageUrl.includes("?") ? "&" : "?"}${cacheBust}`;
  }
  return `${HOMEY_LOCAL_ORIGIN}${imageUrl}?${cacheBust}`;
};

/**
 * Keeps the previous album art visible until the next cover is fully loaded,
 * then swaps — no fade-to-black between tracks. Clears when Homey has no art.
 */
export const useUpdateImageUrls = (device, track, imageRef, containerRef) => {
  const [imageUrl, setImageUrl] = useState();
  const albumArtPath = getImageUrl(device);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const url = resolveAlbumArtUrl(albumArtPath);
    if (!url) {
      requestIdRef.current += 1;
      setImageUrl(undefined);
      if (imageRef?.current) {
        imageRef.current.style.opacity = "1";
      }
      if (containerRef?.current) {
        containerRef.current.style.opacity = "1";
      }
      return undefined;
    }

    const requestId = ++requestIdRef.current;
    const preload = new Image();

    const apply = () => {
      if (requestId !== requestIdRef.current) return;
      setImageUrl(url);
      if (imageRef?.current) {
        imageRef.current.style.opacity = "1";
      }
      if (containerRef?.current) {
        containerRef.current.style.opacity = "1";
      }
    };

    preload.onload = apply;
    preload.onerror = apply;
    preload.src = url;

    return () => {
      preload.onload = null;
      preload.onerror = null;
    };
  }, [track, albumArtPath, imageRef, containerRef]);

  return imageUrl;
};
