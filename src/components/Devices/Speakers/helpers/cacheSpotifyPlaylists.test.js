import { describe, expect, it } from "vitest";
import { parseCachedPlaylists } from "./cacheSpotifyPlaylists";

describe("parseCachedPlaylists", () => {
  it("returns playlists from JSON", () => {
    expect(
      parseCachedPlaylists(JSON.stringify([{ id: "1", name: "fredagsliste" }]))
    ).toEqual([{ id: "1", name: "fredagsliste" }]);
  });

  it("returns an empty list for missing or invalid data", () => {
    expect(parseCachedPlaylists(undefined)).toEqual([]);
    expect(parseCachedPlaylists("nope")).toEqual([]);
    expect(parseCachedPlaylists(JSON.stringify({}))).toEqual([]);
  });
});
