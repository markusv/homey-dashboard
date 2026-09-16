import { useEffect, useRef, useState } from "react";
import { getDeviceAlbumArtUrl } from "../helpers/getDeviceAlbumArtUrl";

/**
 * Keeps the previous album art visible until the next cover is fully loaded,
 * then swaps — no fade-to-black between tracks. Clears when Homey has no art.
 * `initialUrl` is the list-row src so the player can morph the already-decoded image.
 */
export const useUpdateImageUrls = (
  device,
  track,
  imageRef,
  containerRef,
  initialUrl
) => {
  const resolved = getDeviceAlbumArtUrl(device, track);
  const [imageUrl, setImageUrl] = useState(() => resolved || initialUrl);
  const displayedRef = useRef(resolved || initialUrl);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const reveal = (url) => {
      displayedRef.current = url;
      setImageUrl(url);
      if (imageRef?.current) imageRef.current.style.opacity = "1";
      if (containerRef?.current) containerRef.current.style.opacity = "1";
    };

    if (!device) return undefined;

    if (!resolved) {
      requestIdRef.current += 1;
      reveal(undefined);
      return undefined;
    }

    if (resolved === displayedRef.current) return undefined;

    if (!displayedRef.current) {
      reveal(resolved);
      return undefined;
    }

    const requestId = ++requestIdRef.current;
    const preload = new Image();
    const apply = () => {
      if (requestId !== requestIdRef.current) return;
      reveal(resolved);
    };
    preload.onload = apply;
    preload.onerror = apply;
    preload.src = resolved;

    return () => {
      preload.onload = null;
      preload.onerror = null;
    };
  }, [device, resolved, imageRef, containerRef]);

  return imageUrl;
};
