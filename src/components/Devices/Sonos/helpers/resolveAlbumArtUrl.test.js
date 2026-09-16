import { describe, expect, it } from "vitest";
import { resolveAlbumArtUrl } from "./resolveAlbumArtUrl";

describe("resolveAlbumArtUrl", () => {
  it("returns null when Homey has no image", () => {
    expect(resolveAlbumArtUrl(null)).toBeNull();
    expect(resolveAlbumArtUrl("")).toBeNull();
  });

  it("prefixes relative Homey image paths", () => {
    expect(resolveAlbumArtUrl("/api/image/abc")).toBe(
      "https://192-168-68-80.homey.homeylocal.com/api/image/abc"
    );
  });

  it("keeps absolute URLs and cache-busts on track change", () => {
    expect(
      resolveAlbumArtUrl("https://i.scdn.co/cover.jpg", "Blinding Lights")
    ).toBe("https://i.scdn.co/cover.jpg?ts=Blinding%20Lights");
  });
});
