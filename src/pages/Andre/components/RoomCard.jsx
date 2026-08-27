import React from "react";
import { useGetDevice } from "../../../components/Devices/helpers/useGetDevice";
import { useMakeCapabilityInstance } from "../../../components/Devices/helpers/useMakeCapabilityInstance";
import { getHomey } from "../../../helpers/getHomey";
import { updateCapabilityOnDevice } from "../../../components/Devices/helpers/updateCapabolityOnDevice";
import { triggerFlow } from "../../../components/Flows/helpers/triggerFlow";
import { AUDIO_PRO_PLAY_MUSIC_FLOW_ID } from "../../../components/Devices/AudioProSpeaker/constants";
import { IconButton } from "./IconButton";
import { BlindIcon } from "./BlindIcon";
import { FanIcon } from "./FanIcon";
import { VacuumIcon } from "../../../components/Devices/Roborock/VacuumIcon";
import { useActionLock } from "../helpers/useActionLock";
import { useLiveRoomLights } from "../helpers/useLiveRoomLights";
import { useLiveRoomBlinds } from "../helpers/useLiveRoomBlinds";
import { useLiveAirQuality } from "../helpers/useLiveAirQuality";
import { AirQualitySummary } from "./AirQualitySummary";
import { AIR_QUALITY_STATUS_LABELS } from "../helpers/airQualityMetrics";
import { roomThemes } from "../rooms";

const BLIND_FLOW_ICONS = new Set([
  "sun-shades",
  "blinds",
  "rullegardin",
  "gardin",
  "solskjerming",
]);

const formatTemperature = (value) => {
  if (typeof value !== "number") return "–";
  return `${value.toFixed(1)}°`;
};

const RoomTemperature = ({ deviceId }) => {
  const [device, setDevice] = useGetDevice(deviceId);
  useMakeCapabilityInstance(device, setDevice, "measure_temperature");

  const value = device?.capabilitiesObj?.measure_temperature?.value;
  return <div className="andre-room-card-temp">{formatTemperature(value)}</div>;
};

const VacuumAction = ({ deviceId, accent }) => {
  const [device, setDevice] = useGetDevice(deviceId);
  useMakeCapabilityInstance(device, setDevice, "is_cleaning");
  useMakeCapabilityInstance(device, setDevice, "clean_full");
  const [run, pending] = useActionLock();
  const isCleaning = device?.capabilitiesObj?.is_cleaning?.value === true;

  const onStart = async (event) => {
    event.stopPropagation();
    if (!device?.id) return;
    await run(async () => {
      const homeyApi = await getHomey();
      if (device.capabilities?.includes("clean_full")) {
        await homeyApi.devices.setCapabilityValue({
          deviceId: device.id,
          capabilityId: "clean_full",
          value: true,
        });
        return;
      }
      if (device.capabilities?.includes("onoff")) {
        await homeyApi.devices.setCapabilityValue({
          deviceId: device.id,
          capabilityId: "onoff",
          value: true,
        });
      }
    });
  };

  return (
    <IconButton
      label="Start støvsuger"
      active={isCleaning}
      pending={pending}
      onClick={onStart}
      style={isCleaning ? { "--andre-action-accent": accent } : undefined}
      className={isCleaning ? "andre-icon-button--accent" : undefined}
    >
      <VacuumIcon className="andre-vacuum-icon" />
    </IconButton>
  );
};

const FanAction = ({ deviceId, accent }) => {
  const [device, setDevice] = useGetDevice(deviceId);
  useMakeCapabilityInstance(device, setDevice, "onoff");
  const [run, pending] = useActionLock();
  const on = device?.capabilitiesObj?.onoff?.value === true;

  const toggleFan = async (event) => {
    event.stopPropagation();
    await run(async () => {
      if (!device?.id) return;
      const next = !on;
      setDevice((current) =>
        current ? updateCapabilityOnDevice(current, "onoff", next) : current
      );
      const homeyApi = await getHomey();
      await homeyApi.devices.setCapabilityValue({
        deviceId: device.id,
        capabilityId: "onoff",
        value: next,
      });
    });
  };

  return (
    <IconButton
      label={on ? "Slå av vifte" : "Slå på vifte"}
      active={on}
      pending={pending}
      onClick={toggleFan}
      style={on ? { "--andre-action-accent": accent } : undefined}
      className={on ? "andre-icon-button--accent" : undefined}
    >
      <FanIcon spinning={on} className="andre-fan-icon" />
    </IconButton>
  );
};

const SpeakerAction = ({ deviceId, accent }) => {
  const [device, setDevice] = useGetDevice(deviceId);
  useMakeCapabilityInstance(device, setDevice, "speaker_playing");
  const [run, pending] = useActionLock();
  const isPlaying = device?.capabilitiesObj?.speaker_playing?.value === true;
  const hasPlayback = device?.capabilities?.includes("speaker_playing");

  const onClick = async (event) => {
    event.stopPropagation();
    await run(async () => {
      if (hasPlayback && device?.id) {
        const homeyApi = await getHomey();
        await homeyApi.devices.setCapabilityValue({
          deviceId: device.id,
          capabilityId: "speaker_playing",
          value: !isPlaying,
        });
        return;
      }
      await triggerFlow(AUDIO_PRO_PLAY_MUSIC_FLOW_ID);
    });
  };

  return (
    <IconButton
      icon="speaker"
      label="Høyttaler"
      active={isPlaying}
      pending={pending}
      onClick={onClick}
      style={isPlaying ? { "--andre-action-accent": accent } : undefined}
      className={isPlaying ? "andre-icon-button--accent" : undefined}
    />
  );
};

const LightAction = ({ lightState, accent }) => {
  const { lights, on, pending, toggleLights } = lightState;
  if (!lights.length) return null;

  return (
    <IconButton
      icon="lightbulb"
      label={on ? "Slå av lys" : "Slå på lys"}
      active={on}
      pending={pending}
      onClick={toggleLights}
      style={on ? { "--andre-action-accent": accent } : undefined}
      className={on ? "andre-icon-button--accent" : undefined}
    />
  );
};

const BlindActions = ({ blindState, accent }) => {
  const { blinds, pending, raiseBlinds, lowerBlinds } = blindState;
  if (!blinds.length) return null;

  return (
    <>
      <IconButton
        label="Rullegardin opp"
        pending={pending}
        onClick={raiseBlinds}
        style={{ "--andre-action-accent": accent }}
        className="andre-icon-button--accent-soft"
      >
        <BlindIcon direction="up" className="andre-blind-icon" />
      </IconButton>
      <IconButton
        label="Rullegardin ned"
        pending={pending}
        onClick={lowerBlinds}
      >
        <BlindIcon direction="down" className="andre-blind-icon" />
      </IconButton>
    </>
  );
};

const FlowAction = ({ flow, accent }) => {
  const [run, pending] = useActionLock();
  const iconName = flow.icon || "stars";
  const useBlindIcon = BLIND_FLOW_ICONS.has(iconName);

  return (
    <IconButton
      icon={useBlindIcon ? undefined : iconName}
      label={flow.label || "Handling"}
      pending={pending}
      onClick={() => run(() => triggerFlow(flow.id))}
      style={{ "--andre-action-accent": accent }}
      className="andre-icon-button--accent-soft"
    >
      {useBlindIcon ? <BlindIcon className="andre-blind-icon" /> : undefined}
    </IconButton>
  );
};

export const RoomCard = ({ room, devices, zones, onOpen }) => {
  const theme = roomThemes[room.id] || {};
  const accent = theme.accent || "#a78bfa";
  const lightState = useLiveRoomLights(devices, room, zones);
  const blindState = useLiveRoomBlinds(devices, room);
  const { hasAirQuality, readings, overallStatus } = useLiveAirQuality(
    devices,
    room
  );
  const cardFlows = (room.flows || []).filter((flow) => flow.showOnRoomCard);

  const cardStyle = {
    "--andre-room-accent": accent,
    ...(theme.background
      ? { "--andre-room-bg": `url(${theme.background})` }
      : {}),
  };

  return (
    <article
      className="andre-room-card"
      style={cardStyle}
      aria-label={
        hasAirQuality && overallStatus
          ? `${room.name}, luftkvalitet ${AIR_QUALITY_STATUS_LABELS[overallStatus].toLowerCase()}`
          : room.name
      }
    >
      <div className="andre-room-card-bg" aria-hidden="true" />
      <div className="andre-room-card-glow andre-room-card-glow--top" />
      <div className="andre-room-card-glow andre-room-card-glow--bottom" />

      <div className="andre-room-card-content">
        <div
          className="andre-room-card-open"
          role="button"
          tabIndex={0}
          aria-label={`Åpne ${room.name}`}
          onClick={() => onOpen(room)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onOpen(room);
            }
          }}
        >
          <div className="andre-room-card-header">
            {theme.icon && (
              <sl-icon
                name={theme.icon}
                className="andre-room-card-icon"
                style={{ color: accent }}
              />
            )}
            <div className="andre-room-card-name">{room.name}</div>
          </div>

          <div className="andre-room-card-body">
            {room.temperatureDeviceId ? (
              <RoomTemperature deviceId={room.temperatureDeviceId} />
            ) : (
              <div className="andre-room-card-temp andre-room-card-temp--empty">
                –
              </div>
            )}

            {hasAirQuality && <AirQualitySummary readings={readings} compact />}
          </div>
        </div>

        <div className="andre-room-card-actions">
          <LightAction lightState={lightState} accent={accent} />
          {cardFlows.map((flow) => (
            <FlowAction key={flow.id} flow={flow} accent={accent} />
          ))}
          {room.fanDeviceId && (
            <FanAction deviceId={room.fanDeviceId} accent={accent} />
          )}
          <BlindActions blindState={blindState} accent={accent} />
          {room.speakerDeviceId && (
            <SpeakerAction deviceId={room.speakerDeviceId} accent={accent} />
          )}
          {room.vacuumDeviceId && (
            <VacuumAction deviceId={room.vacuumDeviceId} accent={accent} />
          )}
        </div>
      </div>
    </article>
  );
};
