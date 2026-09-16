import { describe, expect, it } from "vitest";
import { SPEAKER_KIND } from "./Speakers.constants";
import {
  getMusicSpeakers,
  getSpeakerKind,
  isMusicSpeaker,
} from "./Speakers.helpers";

const speaker = (overrides = {}) => ({
  id: "speaker-1",
  name: "Kjøkken",
  driverId: "homey:app:com.sonos:sonos",
  capabilities: ["speaker_playing", "speaker_track"],
  capabilitiesObj: {
    speaker_playing: { value: false },
  },
  ...overrides,
});

describe("isMusicSpeaker", () => {
  it("accepts devices with speaker_playing", () => {
    expect(isMusicSpeaker(speaker())).toBe(true);
  });

  it("rejects lights and missing devices", () => {
    expect(isMusicSpeaker(undefined)).toBe(false);
    expect(
      isMusicSpeaker({
        id: "light-1",
        capabilities: ["onoff", "dim"],
        capabilitiesObj: {},
      })
    ).toBe(false);
  });
});

describe("getSpeakerKind", () => {
  it("detects Sonos and Spotify Connect from driverId", () => {
    expect(getSpeakerKind(speaker())).toBe(SPEAKER_KIND.SONOS);
    expect(
      getSpeakerKind(
        speaker({
          driverId: "homey:app:nl.pendo.spotify:spotify-connect",
        })
      )
    ).toBe(SPEAKER_KIND.SPOTIFY);
  });

  it("falls back to other", () => {
    expect(
      getSpeakerKind(speaker({ driverId: "homey:app:com.example:foo" }))
    ).toBe(SPEAKER_KIND.OTHER);
    expect(getSpeakerKind(undefined)).toBe(SPEAKER_KIND.OTHER);
  });
});

describe("getMusicSpeakers", () => {
  it("orders known speakers Kjøkken, Fabian, Stue, Loft", () => {
    const devices = {
      loft: speaker({
        id: "554b8fae-7247-42cf-875e-748fd56408d8",
        name: "Loft",
      }),
      stue: speaker({
        id: "be9cdbf9-01b2-4090-a351-5a0508094d03",
        name: "Sonos Stue",
      }),
      fabian: speaker({
        id: "8fd650ed-38d4-469f-b084-cdab2aac75e1",
        name: "Fabians rom",
      }),
      kitchen: speaker({
        id: "ac98800b-cc10-4d6d-816e-9d8c320593b4",
        name: "Sonos Kjøkken",
      }),
      extra: speaker({ id: "new-sonos", name: "Bad" }),
      light: { id: "light", name: "Taklys", capabilities: ["onoff"] },
    };

    expect(getMusicSpeakers(devices).map((device) => device.name)).toEqual([
      "Sonos Kjøkken",
      "Fabians rom",
      "Sonos Stue",
      "Loft",
      "Bad",
    ]);
  });

  it("accepts an array of devices", () => {
    expect(getMusicSpeakers([speaker({ name: "Fabian" })])).toHaveLength(1);
  });

  it("returns an empty list when devices are missing", () => {
    expect(getMusicSpeakers(undefined)).toEqual([]);
  });
});
