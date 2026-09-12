import { describe, expect, it } from "vitest";
import { WEATHER_OVERLAY_KIND } from "../WeatherOverlay.constants";
import { getWeatherOverlayState } from "./getWeatherOverlayState";

const now = Date.parse("2026-09-12T16:10:00Z");

const entry = ({
  time = "2026-09-12T16:00:00Z",
  symbol,
  mm,
  temperature,
} = {}) => ({
  time,
  data: {
    instant: {
      details: { air_temperature: temperature },
    },
    next_1_hours: {
      summary: { symbol_code: symbol },
      details: { precipitation_amount: mm },
    },
  },
});

describe("getWeatherOverlayState", () => {
  it("returns an empty state without forecast", () => {
    expect(getWeatherOverlayState(undefined, now)).toEqual({
      kind: WEATHER_OVERLAY_KIND.NONE,
      intensity: 0,
      precipitationMm: 0,
      showSun: false,
      sunIntensity: 0,
      symbol: "",
    });
  });

  it("scales light rain from MET millimetres", () => {
    const state = getWeatherOverlayState(
      [entry({ symbol: "lightrain", mm: 0.2 })],
      now
    );
    expect(state.kind).toBe(WEATHER_OVERLAY_KIND.RAIN);
    expect(state.precipitationMm).toBe(0.2);
    expect(state.showSun).toBe(false);
    expect(state.intensity).toBeGreaterThan(0.35);
    expect(state.intensity).toBeLessThan(0.55);
  });

  it("is denser for heavier rainfall", () => {
    const light = getWeatherOverlayState(
      [entry({ symbol: "lightrain", mm: 0.2 })],
      now
    );
    const heavy = getWeatherOverlayState(
      [entry({ symbol: "heavyrain", mm: 5 })],
      now
    );
    expect(heavy.kind).toBe(WEATHER_OVERLAY_KIND.RAIN);
    expect(heavy.intensity).toBe(1);
    expect(heavy.intensity).toBeGreaterThan(light.intensity);
  });

  it("uses snow particles for snow symbols", () => {
    const state = getWeatherOverlayState(
      [entry({ symbol: "heavysnow", mm: 1.2 })],
      now
    );
    expect(state.kind).toBe(WEATHER_OVERLAY_KIND.SNOW);
    expect(state.intensity).toBeGreaterThan(0.5);
  });

  it("shows a background sun for clear daytime", () => {
    const state = getWeatherOverlayState(
      [entry({ symbol: "clearsky_day", mm: 0 })],
      now
    );
    expect(state.kind).toBe(WEATHER_OVERLAY_KIND.NONE);
    expect(state.showSun).toBe(true);
    expect(state.sunIntensity).toBe(1);
  });

  it("does not show sun at night", () => {
    const state = getWeatherOverlayState(
      [entry({ symbol: "clearsky_night", mm: 0 })],
      now
    );
    expect(state.showSun).toBe(false);
  });

  it("infers snow from freezing precip without a rain/snow symbol", () => {
    const state = getWeatherOverlayState(
      [entry({ symbol: "fog", mm: 0.4, temperature: -2 })],
      now
    );
    expect(state.kind).toBe(WEATHER_OVERLAY_KIND.SNOW);
    expect(state.intensity).toBeGreaterThan(0);
  });
});
