import { describe, expect, it } from "vitest";
import { getPrecipMotionScale } from "./getPrecipMotionScale";

describe("getPrecipMotionScale", () => {
  it("is 0 when animation is off", () => {
    expect(
      getPrecipMotionScale({
        animate: false,
        dtSeconds: 1 / 30,
      })
    ).toBe(0);
  });

  it("is elapsed seconds so draw code can scale by the live viewport height", () => {
    expect(
      getPrecipMotionScale({
        animate: true,
        dtSeconds: 1 / 30,
      })
    ).toBeCloseTo(1 / 30);
  });

  it("scales with elapsed time so a slower frame rate does not slow the rain", () => {
    const at30 = getPrecipMotionScale({
      animate: true,
      dtSeconds: 1 / 30,
    });
    const at60 = getPrecipMotionScale({
      animate: true,
      dtSeconds: 1 / 60,
    });
    expect(at30).toBeCloseTo(at60 * 2);
  });
});
