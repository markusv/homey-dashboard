import { useEffect, useState } from "react";
import { getImageUrl } from "../helpers/getImageUrl";

export const useUpdateImageUrls = (device, track, imageRef, containerRef) => {
  const [imageUrl, setImageUrl] = useState();
  useEffect(() => {
    const imageUrl = getImageUrl(device);
    if (!imageUrl) {
      return;
    }
    const url = `https://192-168-68-80.homey.homeylocal.com${imageUrl}?ts=${new Date().getTime()}`;
    if (!imageRef?.current || !containerRef.current) {
      setImageUrl(url);
      return;
    }
    imageRef.current.style.opacity = 0;
    containerRef.current.style.opacity = 0;
    const newImg = new Image();
    newImg.src = url;
    imageRef.current.onload = () => {
      imageRef.current.style.opacity = 1;
      imageRef.current.onload = undefined;
      containerRef.current.style.opacity = 1;
    };
    setImageUrl(url);
  }, [track]);
  return imageUrl;
};
