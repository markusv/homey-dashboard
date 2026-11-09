import { describe, expect, it } from "vitest";
import { briefingRuns } from "./briefingRuns";

describe("briefingRuns", () => {
  it("turns paired stars into bold and keeps a missing close as text", () => {
    expect(briefingRuns("**I morgen**")).toEqual([
      { bold: true, text: "I morgen" },
    ]);
    expect(briefingRuns("Det er **leksfri** i dag.")).toEqual([
      { bold: false, text: "Det er " },
      { bold: true, text: "leksfri" },
      { bold: false, text: " i dag." },
    ]);
    expect(briefingRuns("**uten slutt")).toEqual([
      { bold: false, text: "**uten slutt" },
    ]);
    expect(briefingRuns("tom **** mellom")).toEqual([
      { bold: false, text: "tom  mellom" },
    ]);
  });
});
