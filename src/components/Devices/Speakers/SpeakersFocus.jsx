import React, { useEffect, useState } from "react";
import { FocusedElement } from "../../Focus/FocusedElement/FocusedElement";
import { SonosFocus } from "../Sonos/SonosFocus";
import { SonosFavorites } from "../Sonos/SonosFavorites";
import { getHomey } from "../../../helpers/getHomey";
import { SPEAKER_KIND, SPEAKERS_VIEW } from "./Speakers.constants";
import { getMusicSpeakers, getSpeakerKind } from "./Speakers.helpers";
import { SpeakerList } from "./SpeakerList";
import { SpotifyPlaylists } from "./SpotifyPlaylists";
import "./speakers.css";

const playSonosFavorite = async (deviceId, favorite) => {
  const homeyApi = await getHomey();
  await homeyApi.flow.runFlowCardAction({
    uri: "homey:manager:flow",
    id: `homey:device:${deviceId}:cloud_play_sonos_favorite`,
    args: { favorite },
  });
};

export const SpeakersFocus = ({ close, devices: initialDevices }) => {
  const [devices, setDevices] = useState(initialDevices);
  const [view, setView] = useState(SPEAKERS_VIEW.LIST);
  const [selectedId, setSelectedId] = useState();

  useEffect(() => {
    let cancelled = false;
    const refresh = async () => {
      try {
        const homeyApi = await getHomey();
        const fresh = await homeyApi.devices.getDevices();
        if (!cancelled && fresh) setDevices(fresh);
      } catch {
        // Keep the dashboard snapshot if Homey refresh fails.
      }
    };
    refresh();
    return () => {
      cancelled = true;
    };
  }, []);

  const speakers = getMusicSpeakers(devices);
  const selected = speakers.find((speaker) => speaker.id === selectedId);
  const selectedKind = getSpeakerKind(selected);
  const selectedName = selected?.name || "Høyttaler";
  const hasLibrary =
    selectedKind === SPEAKER_KIND.SONOS ||
    selectedKind === SPEAKER_KIND.SPOTIFY;

  const onSelectSpeaker = (deviceId) => {
    setSelectedId(deviceId);
    setView(SPEAKERS_VIEW.PLAYER);
  };

  if (view === SPEAKERS_VIEW.PLAYER && selectedId) {
    return (
      <SonosFocus
        close={close}
        deviceId={selectedId}
        title={selectedName}
        onBackClick={() => setView(SPEAKERS_VIEW.LIST)}
        onShowLibrary={
          hasLibrary ? () => setView(SPEAKERS_VIEW.LIBRARY) : undefined
        }
      />
    );
  }

  if (view === SPEAKERS_VIEW.LIBRARY && selectedId && hasLibrary) {
    const libraryTitle =
      selectedKind === SPEAKER_KIND.SONOS ? "Favoritter" : "Playlister";
    return (
      <FocusedElement
        title={libraryTitle}
        onCloseClick={close}
        onBackClick={() => setView(SPEAKERS_VIEW.PLAYER)}
      >
        {selectedKind === SPEAKER_KIND.SONOS ? (
          <SonosFavorites
            embedded
            deviceId={selectedId}
            onFavoriteClick={async (favorite) => {
              await playSonosFavorite(selectedId, favorite);
              setView(SPEAKERS_VIEW.PLAYER);
            }}
          />
        ) : (
          <SpotifyPlaylists
            deviceId={selectedId}
            onPlaylistClick={() => setView(SPEAKERS_VIEW.PLAYER)}
          />
        )}
      </FocusedElement>
    );
  }

  return (
    <FocusedElement title="Høyttalere" onCloseClick={close}>
      <SpeakerList speakers={speakers} onSelect={onSelectSpeaker} />
    </FocusedElement>
  );
};
