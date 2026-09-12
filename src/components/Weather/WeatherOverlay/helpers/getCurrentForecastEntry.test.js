import { describe, expect, it } from "vitest";
import { getCurrentForecastEntry } from "./getCurrentForecastEntry";

const now = Date.parse("2026-09-12T16:10:00Z");

describe("getCurrentForecastEntry", () => {
  it("returns null for an empty forecast", () => {
    expect(getCurrentForecastEntry(undefined, now)).toBeNull();
    expect(getCurrentForecastEntry([], now)).toBeNull();
  });

  it("picks the latest hourly slot at or before now (with a short lookahead)", () => {
    const forecast = [
      { time: "2026-09-12T15:00:00Z", id: "15" },
      { time: "2026-09-12T16:00:00Z", id: "16" },
      { time: "2026-09-12T17:00:00Z", id: "17" },
    ];
    expect(getCurrentForecastEntry(forecast, now).id).toBe("16");
  });

  it("can use a slot up to 20 minutes in the future", () => {
    const forecast = [
      { time: "2026-09-12T16:00:00Z", id: "16" },
      { time: "2026-09-12T17:00:00Z", id: "17" },
    ];
    expect(
      getCurrentForecastEntry(forecast, Date.parse("2026-09-12T16:50:00Z")).id
    ).toBe("17");
  });
});
