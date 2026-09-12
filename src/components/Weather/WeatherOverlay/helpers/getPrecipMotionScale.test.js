import { describe, expect, it } from "vitest";
import { getPrecipMotionScale } from "./getPrecipMotionScale";

describe("getPrecipMotionScale", () => {
  it("is 0 when animation is off", () => {
    expect(
      getPrecipMotionScale({
        animate: false,
        intensity: 1,
        dtSeconds: 1 / 30,
      })
    ).toBe(0);
  });

  it("does not bake in a kiosk size — height is applied at draw time from the viewport", () => {
    const motion = getPrecipMotionScale({
      animate: true,
      intensity: 1,
      dtSeconds: 1 / 30,
    });
    expect(motion).toBeCloseTo((0.7 + 0.65) * (1 / 30));
  });

  it("scales with elapsed time so a slower frame rate does not slow the rain", () => {
    const at30 = getPrecipMotionScale({
      animate: true,
      intensity: 0.5,
      dtSeconds: 1 / 30,
    });
    const at60 = getPrecipMotionScale({
      animate: true,
      intensity: 0.5,
      dtSeconds: 1 / 60,
    });
    expect(at30).toBeCloseTo(at60 * 2);
  });
});
