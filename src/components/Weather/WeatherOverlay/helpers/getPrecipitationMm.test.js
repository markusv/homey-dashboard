import { describe, expect, it } from "vitest";
import { getPrecipitationMm } from "./getPrecipitationMm";

describe("getPrecipitationMm", () => {
  it("reads precipitation_amount from a MET period", () => {
    expect(getPrecipitationMm({ details: { precipitation_amount: 0.2 } })).toBe(
      0.2
    );
  });

  it("treats missing or non-positive values as 0", () => {
    expect(getPrecipitationMm(undefined)).toBe(0);
    expect(getPrecipitationMm({ details: { precipitation_amount: 0 } })).toBe(
      0
    );
    expect(
      getPrecipitationMm({ details: { precipitation_amount: "0.2" } })
    ).toBe(0);
  });
});
