import { describe, expect, it } from "vitest";
import { clampOffset, nextSwipeOffset } from "./nextSwipeOffset";

describe("clampOffset", () => {
  it("keeps the strip inside its track", () => {
    expect(clampOffset(-20, 400)).toBe(0);
    expect(clampOffset(80, 400)).toBe(80);
    expect(clampOffset(900, 400)).toBe(400);
    expect(clampOffset(10, 0)).toBe(0);
  });
});

describe("nextSwipeOffset", () => {
  it("moves the strip opposite the finger", () => {
    expect(nextSwipeOffset(100, -40, 400)).toBe(140);
    expect(nextSwipeOffset(20, 50, 400)).toBe(0);
  });
});
