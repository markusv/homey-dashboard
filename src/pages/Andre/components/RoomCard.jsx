import React from "react";
import { useGetDevice } from "../../../components/Devices/helpers/useGetDevice";
import { useMakeCapabilityInstance } from "../../../components/Devices/helpers/useMakeCapabilityInstance";
import { getHomey } from "../../../helpers/getHomey";
import { triggerFlow } from "../../../components/Flows/helpers/triggerFlow";
import { AUDIO_PRO_PLAY_MUSIC_FLOW_ID } from "../../../components/Devices/AudioProSpeaker/constants";
import { IconButton } from "./IconButton";
import { useActionLock } from "../helpers/useActionLock";
import { useLiveRoomLights } from "../helpers/useLiveRoomLights";

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

const VacuumAction = ({ deviceId }) => {
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
      icon="robot"
      label="Start støvsuger"
      active={isCleaning}
      pending={pending}
      onClick={onStart}
    />
  );
};

const SpeakerAction = ({ deviceId }) => {
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
    />
  );
};

const LightAction = ({ lightState }) => {
  const { lights, on, color, pending, toggleLights } = lightState;
  if (!lights.length) return null;

  const activeStyle =
    on && color
      ? {
          color,
        }
      : undefined;

  return (
    <IconButton
      icon="lightbulb"
      label={on ? "Slå av lys" : "Slå på lys"}
      active={on}
      pending={pending}
      onClick={toggleLights}
      style={activeStyle}
      className={on ? "andre-icon-button--lit" : undefined}
    />
  );
};

export const RoomCard = ({ room, devices, onOpen }) => {
  const lightState = useLiveRoomLights(devices, room);

  return (
    <article
      className="andre-room-card"
      onClick={() => onOpen(room)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(room);
        }
      }}
    >
      <div className="andre-room-card-name">{room.name}</div>
      {room.temperatureDeviceId ? (
        <RoomTemperature deviceId={room.temperatureDeviceId} />
      ) : (
        <div className="andre-room-card-temp andre-room-card-temp--empty">
          –
        </div>
      )}
      <div className="andre-room-card-actions">
        <LightAction lightState={lightState} />
        {room.speakerDeviceId && (
          <SpeakerAction deviceId={room.speakerDeviceId} />
        )}
        {room.vacuumDeviceId && <VacuumAction deviceId={room.vacuumDeviceId} />}
      </div>
    </article>
  );
};
