import { describe, expect, it } from "vitest";
import { WEATHER_OVERLAY_KIND } from "../WeatherOverlay.constants";
import { getOverlayParticleCount } from "./getOverlayParticleCount";

describe("getOverlayParticleCount", () => {
  it("returns 0 when there is no precip", () => {
    expect(
      getOverlayParticleCount(WEATHER_OVERLAY_KIND.NONE, 1, 800, 480)
    ).toBe(0);
    expect(
      getOverlayParticleCount(WEATHER_OVERLAY_KIND.RAIN, 0, 800, 480)
    ).toBe(0);
  });

  it("keeps light rain sparse and heavy rain much denser", () => {
    const lightStue = getOverlayParticleCount(
      WEATHER_OVERLAY_KIND.RAIN,
      0.44,
      800,
      480
    );
    const rainStue = getOverlayParticleCount(
      WEATHER_OVERLAY_KIND.RAIN,
      0.72,
      800,
      480
    );
    const heavyStue = getOverlayParticleCount(
      WEATHER_OVERLAY_KIND.RAIN,
      1,
      800,
      480
    );
    expect(lightStue).toBeGreaterThanOrEqual(20);
    expect(lightStue).toBeLessThan(rainStue);
    expect(heavyStue).toBeGreaterThan(rainStue * 1.4);
  });

  it("does not cap moderate and heavy rain to the same count on Entre", () => {
    const rainEntre = getOverlayParticleCount(
      WEATHER_OVERLAY_KIND.RAIN,
      0.72,
      1920,
      1080
    );
    const heavyEntre = getOverlayParticleCount(
      WEATHER_OVERLAY_KIND.RAIN,
      1,
      1920,
      1080
    );
    expect(heavyEntre).toBeGreaterThan(rainEntre);
    expect(heavyEntre).toBeLessThanOrEqual(320);
  });

  it("keeps moderate snow sparser than heavy snow", () => {
    const snowStue = getOverlayParticleCount(
      WEATHER_OVERLAY_KIND.SNOW,
      0.55,
      800,
      480
    );
    const heavyStue = getOverlayParticleCount(
      WEATHER_OVERLAY_KIND.SNOW,
      1,
      800,
      480
    );
    const snowEntre = getOverlayParticleCount(
      WEATHER_OVERLAY_KIND.SNOW,
      0.55,
      1920,
      1080
    );
    const heavyEntre = getOverlayParticleCount(
      WEATHER_OVERLAY_KIND.SNOW,
      1,
      1920,
      1080
    );
    expect(heavyStue).toBeGreaterThan(snowStue * 1.4);
    expect(heavyEntre).toBeGreaterThan(snowEntre);
    expect(heavyEntre).toBeLessThanOrEqual(320);
  });
});
