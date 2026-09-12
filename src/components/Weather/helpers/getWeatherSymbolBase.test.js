import { describe, expect, it } from "vitest";
import {
  getWeatherSymbolBase,
  isDaytimeWeatherSymbol,
} from "./getWeatherSymbolBase";

describe("getWeatherSymbolBase", () => {
  it("strips day, night and polar twilight suffixes", () => {
    expect(getWeatherSymbolBase("clearsky_day")).toBe("clearsky");
    expect(getWeatherSymbolBase("partlycloudy_night")).toBe("partlycloudy");
    expect(getWeatherSymbolBase("fair_polartwilight")).toBe("fair");
    expect(getWeatherSymbolBase("lightrain")).toBe("lightrain");
  });

  it("returns an empty string for missing codes", () => {
    expect(getWeatherSymbolBase()).toBe("");
    expect(getWeatherSymbolBase("")).toBe("");
  });
});

describe("isDaytimeWeatherSymbol", () => {
  it("is true only for _day symbols", () => {
    expect(isDaytimeWeatherSymbol("fair_day")).toBe(true);
    expect(isDaytimeWeatherSymbol("fair_night")).toBe(false);
    expect(isDaytimeWeatherSymbol("lightrain")).toBe(false);
  });
});
