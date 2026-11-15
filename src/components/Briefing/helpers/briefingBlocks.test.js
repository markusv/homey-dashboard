import { describe, expect, it } from "vitest";
import { briefingBlocks, twemojiCode } from "./briefingBlocks";

describe("briefingBlocks", () => {
  it("turns each line into a paragraph and keeps bold", () => {
    expect(briefingBlocks("📅 I morgen\n\n**2 matpakker**")).toEqual([
      [
        { bold: false, emoji: true, text: "📅" },
        { bold: false, emoji: false, text: " I morgen" },
      ],
      [{ bold: true, emoji: false, text: "2 matpakker" }],
    ]);
  });

  it("keeps a variation selector on the emoji", () => {
    const [paragraph] = briefingBlocks("🌤️ Vær");
    expect(paragraph[0]).toMatchObject({ emoji: true, bold: false });
    expect(twemojiCode(paragraph[0].text)).toBe("1f324");
    expect(paragraph[1]).toEqual({
      bold: false,
      emoji: false,
      text: " Vær",
    });
  });
});

describe("twemojiCode", () => {
  it("builds Twemoji filenames for sequences", () => {
    expect(twemojiCode("📅")).toBe("1f4c5");
    expect(twemojiCode("✅")).toBe("2705");
    expect(twemojiCode("👨‍👩‍👧")).toBe("1f468-200d-1f469-200d-1f467");
    expect(twemojiCode("❤️‍🔥")).toBe("2764-fe0f-200d-1f525");
    expect(twemojiCode("🇳🇴")).toBe("1f1f3-1f1f4");
    expect(twemojiCode("1️⃣")).toBe("31-20e3");
  });
});
