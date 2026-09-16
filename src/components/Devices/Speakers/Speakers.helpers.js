import { SPEAKER_KIND, SPEAKER_LIST_ORDER } from "./Speakers.constants";

export const isMusicSpeaker = (device) => {
  if (!device) return false;
  const caps = device.capabilities || Object.keys(device.capabilitiesObj || {});
  return caps.includes("speaker_playing");
};

export const getSpeakerKind = (device) => {
  const driverId = String(device?.driverId || "").toLowerCase();
  if (driverId.includes("sonos")) return SPEAKER_KIND.SONOS;
  if (driverId.includes("spotify")) return SPEAKER_KIND.SPOTIFY;
  return SPEAKER_KIND.OTHER;
};

export const getMusicSpeakers = (devices) => {
  const list = Array.isArray(devices) ? devices : Object.values(devices || {});

  return list.filter(isMusicSpeaker).sort((a, b) => {
    const aIndex = SPEAKER_LIST_ORDER.indexOf(a.id);
    const bIndex = SPEAKER_LIST_ORDER.indexOf(b.id);
    const aOrder = aIndex === -1 ? SPEAKER_LIST_ORDER.length : aIndex;
    const bOrder = bIndex === -1 ? SPEAKER_LIST_ORDER.length : bIndex;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return (a.name || "").localeCompare(b.name || "", "nb");
  });
};

export const getSpotifyPlayPlaylistCardId = (deviceId) =>
  `homey:device:${deviceId}:play_playlist`;
