import { OVERLAY_PIXEL_BUDGET } from "../WeatherOverlay.constants";

export const getOverlayCanvasScale = (width, height, devicePixelRatio = 1) => {
  if (!width || !height) {
    return 1;
  }
  const dpr = Math.min(devicePixelRatio || 1, 1);
  const nativePixels = width * height * dpr * dpr;
  if (nativePixels <= OVERLAY_PIXEL_BUDGET) {
    return dpr;
  }
  return Math.sqrt(OVERLAY_PIXEL_BUDGET / (width * height));
};
