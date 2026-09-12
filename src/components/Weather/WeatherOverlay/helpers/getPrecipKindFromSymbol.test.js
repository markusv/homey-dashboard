import { describe, expect, it } from "vitest";
import { WEATHER_OVERLAY_KIND } from "../WeatherOverlay.constants";
import {
  getPrecipKindFromSymbol,
  getSymbolIntensityFloor,
} from "./getPrecipKindFromSymbol";

describe("getPrecipKindFromSymbol", () => {
  it("maps MET bases to rain, snow or sleet", () => {
    expect(getPrecipKindFromSymbol("lightrain")).toBe(
      WEATHER_OVERLAY_KIND.RAIN
    );
    expect(getPrecipKindFromSymbol("heavyrainshowersandthunder")).toBe(
      WEATHER_OVERLAY_KIND.RAIN
    );
    expect(getPrecipKindFromSymbol("lightsnowshowers")).toBe(
      WEATHER_OVERLAY_KIND.SNOW
    );
    expect(getPrecipKindFromSymbol("heavysleet")).toBe(
      WEATHER_OVERLAY_KIND.SLEET
    );
    expect(getPrecipKindFromSymbol("clearsky")).toBeNull();
  });
});

describe("getSymbolIntensityFloor", () => {
  it("uses heavier floors for heavy/unqualified precip symbols", () => {
    expect(getSymbolIntensityFloor("lightrain")).toBe(0.4);
    expect(getSymbolIntensityFloor("rain")).toBe(0.62);
    expect(getSymbolIntensityFloor("heavysnow")).toBe(0.88);
    expect(getSymbolIntensityFloor("cloudy")).toBe(0);
  });
});
