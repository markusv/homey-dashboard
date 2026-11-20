import { describe, expect, it } from "vitest";
import { pickStueActivity, STUE_ACTIVITY } from "./pickStueActivity";

describe("pickStueActivity", () => {
  it("stays empty when nothing is active", () => {
    expect(
      pickStueActivity({
        robotRunning: false,
        speakerPlaying: false,
        startedAt: {},
      })
    ).toBeNull();
  });

  it("follows whichever activity started last", () => {
    expect(
      pickStueActivity({
        robotRunning: true,
        speakerPlaying: true,
        startedAt: { roborock: 20, kitchen: 10 },
      })
    ).toBe(STUE_ACTIVITY.ROBOROCK);
    expect(
      pickStueActivity({
        robotRunning: true,
        speakerPlaying: true,
        startedAt: { roborock: 10, kitchen: 20 },
      })
    ).toBe(STUE_ACTIVITY.KITCHEN_SPEAKER);
  });

  it("prefers the kitchen speaker when both were already active", () => {
    expect(
      pickStueActivity({
        robotRunning: true,
        speakerPlaying: true,
        startedAt: { roborock: 5, kitchen: 5 },
      })
    ).toBe(STUE_ACTIVITY.KITCHEN_SPEAKER);
  });

  it("falls back to the activity that is still going", () => {
    expect(
      pickStueActivity({
        robotRunning: true,
        speakerPlaying: false,
        startedAt: { roborock: 1, kitchen: 50 },
      })
    ).toBe(STUE_ACTIVITY.ROBOROCK);
  });
});
