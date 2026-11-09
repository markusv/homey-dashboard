import { describe, expect, it } from "vitest";
import { briefingReadPath, isBriefingKind } from "./briefingKind";

describe("isBriefingKind", () => {
  it("accepts the evening and next-week briefings", () => {
    expect(isBriefingKind("evening")).toBe(true);
    expect(isBriefingKind("next-week")).toBe(true);
  });

  it("rejects other values", () => {
    expect(isBriefingKind("weekday-morning")).toBe(false);
    expect(isBriefingKind("")).toBe(false);
  });
});

describe("briefingReadPath", () => {
  it("points at the dashboard read route", () => {
    expect(briefingReadPath("evening")).toBe("/api/read/briefing/evening");
    expect(briefingReadPath("next-week")).toBe("/api/read/briefing/next-week");
  });
});
