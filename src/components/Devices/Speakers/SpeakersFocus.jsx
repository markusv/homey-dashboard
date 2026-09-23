import React, {
  addTransitionType,
  startTransition,
  useEffect,
  useState,
  ViewTransition,
} from "react";
import { flushSync } from "react-dom";
import { FocusedElement } from "../../Focus/FocusedElement/FocusedElement";
import { SonosFocus } from "../Sonos/SonosFocus";
import { SonosFavorites } from "../Sonos/SonosFavorites";
import { getHomey } from "../../../helpers/getHomey";
import {
  SPEAKER_KIND,
  SPEAKERS_TRANSITION,
  SPEAKERS_VIEW,
} from "./Speakers.constants";
import {
  getMusicSpeakers,
  getSpeakerKind,
  getSpeakerShareName,
  getSpeakersHeaderTitle,
} from "./Speakers.helpers";
import { getDeviceAlbumArtUrl } from "../Sonos/helpers/getDeviceAlbumArtUrl";
import { SpeakerList } from "./SpeakerList";
import { SpotifyPlaylists } from "./SpotifyPlaylists";
import { prefetchSonosFavorites } from "../Sonos/hooks/useGetFavoritees";
import { prefetchSpotifyPlaylists } from "./hooks/useGetSpotifyPlaylists";
import "./speakers.css";

const playSonosFavorite = async (deviceId, favorite) => {
  const homeyApi = await getHomey();
  await homeyApi.flow.runFlowCardAction({
    uri: "homey:manager:flow",
    id: `homey:device:${deviceId}:cloud_play_sonos_favorite`,
    args: { favorite },
  });
};

const speakersViewTransition = {
  enter: {
    [SPEAKERS_TRANSITION.FORWARD]: "speakers-enter-forward",
    [SPEAKERS_TRANSITION.BACK]: "speakers-enter-back",
  },
  exit: {
    [SPEAKERS_TRANSITION.FORWARD]: "speakers-exit-forward",
    [SPEAKERS_TRANSITION.BACK]: "speakers-exit-back",
  },
};

const SpeakersPane = ({ children }) => (
  <ViewTransition {...speakersViewTransition} default="none" update="none">
    <div className="speakers-view">{children}</div>
  </ViewTransition>
);

export const SpeakersFocus = ({ close, devices: initialDevices }) => {
  const [devices, setDevices] = useState(initialDevices);
  const [view, setView] = useState(SPEAKERS_VIEW.LIST);
  const [selectedId, setSelectedId] = useState();
  const [clickedCoverUrl, setClickedCoverUrl] = useState();
  const [playerBackgroundUrl, setPlayerBackgroundUrl] = useState();

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

  useEffect(() => {
    getMusicSpeakers(devices).forEach((speaker) => {
      const kind = getSpeakerKind(speaker);
      if (kind === SPEAKER_KIND.SONOS) prefetchSonosFavorites(speaker.id);
      if (kind === SPEAKER_KIND.SPOTIFY) prefetchSpotifyPlaylists(speaker.id);
    });
  }, [devices]);

  const speakers = getMusicSpeakers(devices);
  const selected = speakers.find((speaker) => speaker.id === selectedId);
  const selectedKind = getSpeakerKind(selected);
  const selectedName = selected?.name || "Høyttaler";
  const selectedCover =
    clickedCoverUrl === null
      ? undefined
      : clickedCoverUrl ||
        getDeviceAlbumArtUrl(
          selected,
          selected?.capabilitiesObj?.speaker_track?.value
        );
  const hasLibrary =
    selectedKind === SPEAKER_KIND.SONOS ||
    selectedKind === SPEAKER_KIND.SPOTIFY;
  const title = getSpeakersHeaderTitle({
    view,
    selectedName,
    selectedKind,
  });

  const navigate = (nextView, type, nextId, coverUrl) => {
    if (nextId !== undefined) {
      flushSync(() => {
        setSelectedId(nextId);
        if (coverUrl !== undefined) setClickedCoverUrl(coverUrl);
      });
    }
    startTransition(() => {
      addTransitionType(type);
      setView(nextView);
    });
  };

  const onBackClick =
    view === SPEAKERS_VIEW.LIST
      ? undefined
      : () =>
          navigate(
            view === SPEAKERS_VIEW.LIBRARY
              ? SPEAKERS_VIEW.PLAYER
              : SPEAKERS_VIEW.LIST,
            SPEAKERS_TRANSITION.BACK
          );

  return (
    <FocusedElement
      title={title}
      titleTransitionName={
        view === SPEAKERS_VIEW.PLAYER
          ? getSpeakerShareName("name", selectedId)
          : undefined
      }
      onCloseClick={close}
      onBackClick={onBackClick}
      backgroundImageUrl={
        view === SPEAKERS_VIEW.PLAYER
          ? playerBackgroundUrl || selectedCover
          : undefined
      }
    >
      <div className="speakers-stage">
        <div
          className={
            view === SPEAKERS_VIEW.LIST
              ? "speakers-layer"
              : "speakers-layer speakers-layer--parked"
          }
          inert={view !== SPEAKERS_VIEW.LIST}
          aria-hidden={view !== SPEAKERS_VIEW.LIST}
        >
          <SpeakersPane>
            <SpeakerList
              speakers={speakers}
              shareDeviceId={
                view === SPEAKERS_VIEW.LIST ? selectedId : undefined
              }
              shareCoverUrl={clickedCoverUrl}
              onSelect={(deviceId, coverUrl) =>
                navigate(
                  SPEAKERS_VIEW.PLAYER,
                  SPEAKERS_TRANSITION.FORWARD,
                  deviceId,
                  coverUrl
                )
              }
            />
          </SpeakersPane>
        </div>
        {view === SPEAKERS_VIEW.PLAYER && selectedId ? (
          <SpeakersPane>
            <SonosFocus
              overlay
              deviceId={selectedId}
              device={selected}
              initialCoverUrl={selectedCover}
              artTransitionName={getSpeakerShareName("art", selectedId)}
              onBackgroundUrlChange={setPlayerBackgroundUrl}
              onShowLibrary={
                hasLibrary
                  ? () =>
                      navigate(
                        SPEAKERS_VIEW.LIBRARY,
                        SPEAKERS_TRANSITION.FORWARD
                      )
                  : undefined
              }
            />
          </SpeakersPane>
        ) : null}
        {view === SPEAKERS_VIEW.LIBRARY && selectedId && hasLibrary ? (
          <SpeakersPane>
            {selectedKind === SPEAKER_KIND.SONOS ? (
              <SonosFavorites
                embedded
                deviceId={selectedId}
                onFavoriteClick={async (favorite) => {
                  await playSonosFavorite(selectedId, favorite);
                  navigate(SPEAKERS_VIEW.PLAYER, SPEAKERS_TRANSITION.BACK);
                }}
              />
            ) : (
              <SpotifyPlaylists
                deviceId={selectedId}
                onPlaylistClick={() =>
                  navigate(SPEAKERS_VIEW.PLAYER, SPEAKERS_TRANSITION.BACK)
                }
              />
            )}
          </SpeakersPane>
        ) : null}
      </div>
    </FocusedElement>
  );
};
