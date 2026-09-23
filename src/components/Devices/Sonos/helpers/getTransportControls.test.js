import { describe, expect, it } from "vitest";
import { getTransportControls } from "./getTransportControls";

describe("getTransportControls", () => {
  it("keeps prev, play, and next in place while the device is still loading", () => {
    expect(getTransportControls(undefined)).toEqual({
      pending: true,
      showShuffle: false,
      showPrev: true,
      showNext: true,
      isPlaying: false,
    });
  });

  it("shows only the controls the speaker actually has", () => {
    expect(
      getTransportControls({
        capabilities: ["speaker_playing", "speaker_next", "speaker_prev"],
        capabilitiesObj: { speaker_playing: { value: true } },
      })
    ).toEqual({
      pending: false,
      showShuffle: false,
      showPrev: true,
      showNext: true,
      isPlaying: true,
    });
  });
});
