import { describe, expect, it } from "vitest";
import { uniquePlaylists } from "./uniquePlaylists";

describe("uniquePlaylists", () => {
  it("keeps the first playlist when Homey repeats the same id", () => {
    const playlists = uniquePlaylists([
      { id: "IRyelbYFej2WNzLGr5Kkh", name: "Kardemommeby" },
      { id: "other", name: "NRJ" },
      { id: "IRyelbYFej2WNzLGr5Kkh", name: "Kardemommeby" },
    ]);

    expect(playlists.map((playlist) => playlist.name)).toEqual([
      "Kardemommeby",
      "NRJ",
    ]);
  });

  it("keeps playlists that share an id but have different names", () => {
    const playlists = uniquePlaylists([
      { id: "shared", name: "Kardemomme" },
      { id: "shared", name: "Kardemommeby" },
    ]);

    expect(playlists.map((playlist) => playlist.name)).toEqual([
      "Kardemomme",
      "Kardemommeby",
    ]);
  });
});
