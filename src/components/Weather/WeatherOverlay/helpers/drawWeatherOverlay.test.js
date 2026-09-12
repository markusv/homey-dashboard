import { describe, expect, it } from "vitest";
import { WEATHER_OVERLAY_KIND } from "../WeatherOverlay.constants";
import { createPrecipParticles } from "./drawWeatherOverlay";

describe("createPrecipParticles", () => {
  it("creates raindrops for rain", () => {
    const particles = createPrecipParticles({
      kind: WEATHER_OVERLAY_KIND.RAIN,
      count: 10,
      width: 800,
      height: 480,
    });
    expect(particles.rain).toHaveLength(10);
    expect(particles.snow).toHaveLength(0);
  });

  it("creates snowflakes for snow", () => {
    const particles = createPrecipParticles({
      kind: WEATHER_OVERLAY_KIND.SNOW,
      count: 8,
      width: 800,
      height: 480,
    });
    expect(particles.rain).toHaveLength(0);
    expect(particles.snow).toHaveLength(8);
  });

  it("splits sleet into rain and snow", () => {
    const particles = createPrecipParticles({
      kind: WEATHER_OVERLAY_KIND.SLEET,
      count: 10,
      width: 800,
      height: 480,
    });
    expect(particles.rain).toHaveLength(6);
    expect(particles.snow).toHaveLength(4);
  });
});
