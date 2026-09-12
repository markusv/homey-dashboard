import { describe, expect, it } from "vitest";
import { OVERLAY_PIXEL_BUDGET } from "../WeatherOverlay.constants";
import { getOverlayCanvasScale } from "./getOverlayCanvasScale";

describe("getOverlayCanvasScale", () => {
  it("keeps a small viewport at 1×", () => {
    expect(getOverlayCanvasScale(800, 480, 1)).toBe(1);
  });

  it("downsamples a 1080p viewport so backing-store pixels stay near the budget", () => {
    const scale = getOverlayCanvasScale(1920, 1080, 1);
    expect(scale).toBeLessThan(1);
    expect(1920 * 1080 * scale * scale).toBeCloseTo(OVERLAY_PIXEL_BUDGET, 0);
  });
});
