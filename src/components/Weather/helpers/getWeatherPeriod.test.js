import { describe, expect, it } from "vitest";
import { getWeatherPeriod } from "./getWeatherPeriod";

describe("getWeatherPeriod", () => {
  it("prefers the 1-hour period when present", () => {
    const next1 = { summary: { symbol_code: "lightrain" } };
    expect(
      getWeatherPeriod({
        data: {
          next_1_hours: next1,
          next_6_hours: { summary: { symbol_code: "rain" } },
        },
      })
    ).toBe(next1);
  });

  it("falls back to 6-hour then 12-hour periods", () => {
    const next6 = { summary: { symbol_code: "rain" } };
    expect(getWeatherPeriod({ data: { next_6_hours: next6 } })).toBe(next6);

    const next12 = { summary: { symbol_code: "cloudy" } };
    expect(getWeatherPeriod({ data: { next_12_hours: next12 } })).toBe(next12);
  });

  it("returns null when no period exists", () => {
    expect(getWeatherPeriod(null)).toBeNull();
    expect(getWeatherPeriod({ data: {} })).toBeNull();
  });
});
