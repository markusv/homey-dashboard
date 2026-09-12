import { describe, expect, it } from "vitest";
import { WEATHER_OVERLAY_KIND } from "../WeatherOverlay.constants";
import { getWeatherOverlayPreview } from "./getWeatherOverlayPreview";

describe("getWeatherOverlayPreview", () => {
  it("returns null without an overlay query", () => {
    expect(getWeatherOverlayPreview("")).toBeNull();
    expect(getWeatherOverlayPreview("?foo=bar")).toBeNull();
  });

  it("forces a heavy-rain overlay from the query string", () => {
    const state = getWeatherOverlayPreview("?overlay=heavyrain");
    expect(state.kind).toBe(WEATHER_OVERLAY_KIND.RAIN);
    expect(state.intensity).toBe(1);
    expect(state.precipitationMm).toBe(5);
  });
});
