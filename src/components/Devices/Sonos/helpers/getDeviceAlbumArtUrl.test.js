import { describe, expect, it } from "vitest";
import { getDeviceAlbumArtUrl } from "./getDeviceAlbumArtUrl";

const deviceWithArt = {
  images: [{ imageObj: { url: "/api/image/abc" } }],
};

describe("getDeviceAlbumArtUrl", () => {
  it("returns null without a track, so idle speakers have no cover URL", () => {
    expect(getDeviceAlbumArtUrl(deviceWithArt, "")).toBeNull();
    expect(getDeviceAlbumArtUrl(deviceWithArt, "  ")).toBeNull();
    expect(getDeviceAlbumArtUrl(deviceWithArt)).toBeNull();
  });

  it("matches the list cover URL including track cache-bust", () => {
    expect(getDeviceAlbumArtUrl(deviceWithArt, "Blinding Lights")).toBe(
      "https://192-168-68-80.homey.homeylocal.com/api/image/abc?ts=Blinding%20Lights"
    );
  });
});
