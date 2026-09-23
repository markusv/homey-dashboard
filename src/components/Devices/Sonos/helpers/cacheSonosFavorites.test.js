import { describe, expect, it } from "vitest";
import { parseCachedFavorites } from "./cacheSonosFavorites";

describe("parseCachedFavorites", () => {
  it("returns favorites from JSON", () => {
    expect(
      parseCachedFavorites(JSON.stringify([{ id: "1", name: "Kveld" }]))
    ).toEqual([{ id: "1", name: "Kveld" }]);
  });

  it("returns an empty list for missing or invalid data", () => {
    expect(parseCachedFavorites(undefined)).toEqual([]);
    expect(parseCachedFavorites("nope")).toEqual([]);
    expect(parseCachedFavorites(JSON.stringify({}))).toEqual([]);
  });
});
