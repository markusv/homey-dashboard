import { describe, expect, it } from "vitest";
import { WEATHER_OVERLAY_KIND } from "../WeatherOverlay.constants";
import { getPrecipDropCount, getPrecipDrops } from "./getPrecipDrops";

describe("getPrecipDrops", () => {
  it("returns no drops when there is no precip", () => {
    expect(getPrecipDrops(WEATHER_OVERLAY_KIND.NONE, 1)).toEqual([]);
    expect(getPrecipDropCount(WEATHER_OVERLAY_KIND.RAIN, 0)).toBe(0);
  });

  it("creates more drops for heavy rain than light rain", () => {
    const light = getPrecipDrops(WEATHER_OVERLAY_KIND.RAIN, 0.44);
    const heavy = getPrecipDrops(WEATHER_OVERLAY_KIND.RAIN, 1);
    expect(light.length).toBeGreaterThanOrEqual(20);
    expect(heavy.length).toBeGreaterThan(light.length * 1.3);
    expect(heavy.every((drop) => drop.isRain)).toBe(true);
  });

  it("splits sleet into rain and snow drops", () => {
    const drops = getPrecipDrops(WEATHER_OVERLAY_KIND.SLEET, 1);
    expect(drops.some((drop) => drop.isRain)).toBe(true);
    expect(drops.some((drop) => !drop.isRain)).toBe(true);
  });

  it("is stable for the same kind and intensity", () => {
    expect(getPrecipDrops(WEATHER_OVERLAY_KIND.RAIN, 0.7)).toEqual(
      getPrecipDrops(WEATHER_OVERLAY_KIND.RAIN, 0.7)
    );
  });
});
