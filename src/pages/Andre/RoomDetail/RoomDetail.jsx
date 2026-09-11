import React from "react";
import { SlButton } from "@shoelace-style/shoelace/dist/react";
import { useLiveRoomLights } from "../hooks/useLiveRoomLights";
import { useLiveRoomBlinds } from "../hooks/useLiveRoomBlinds";
import { useLiveAirQuality } from "../hooks/useLiveAirQuality";
import { FlowsSection } from "./FlowsSection/FlowsSection";
import { TemperatureSection } from "./TemperatureSection/TemperatureSection";
import { AirQualitySection } from "./AirQualitySection/AirQualitySection";
import { HeatPumpSection } from "./HeatPumpSection/HeatPumpSection";
import { LightsSection } from "./LightsSection/LightsSection";
import { SpeakerSection } from "./SpeakerSection/SpeakerSection";
import { roomThemes } from "../rooms.constants";

export const RoomDetail = ({ room, devices, zones, onBack }) => {
  const accent = roomThemes[room.id]?.accent || "#a78bfa";
  const lightState = useLiveRoomLights(devices, room, zones);
  const blindState = useLiveRoomBlinds(devices, room);
  const {
    deviceId: airQualityDeviceId,
    readings,
    overallStatus,
  } = useLiveAirQuality(devices, room);

  return (
    <div
      className="andre-room-detail"
      style={{ "--andre-room-accent": accent }}
    >
      <header className="andre-room-detail-header">
        <SlButton
          size="large"
          className="andre-back-button"
          onClick={onBack}
          aria-label="Tilbake"
        >
          <sl-icon slot="prefix" name="arrow-left" />
          Tilbake
        </SlButton>
        <h1 className="andre-room-detail-title">{room.name}</h1>
      </header>

      <div className="andre-room-detail-body">
        <FlowsSection
          flows={room.flows}
          vacuumDeviceId={room.vacuumDeviceId}
          fanDeviceId={room.fanDeviceId}
          lightState={lightState}
          blindState={blindState}
        />

        {room.heatPumpDeviceId && (
          <HeatPumpSection deviceId={room.heatPumpDeviceId} />
        )}

        {room.temperatureDeviceId && (
          <TemperatureSection
            deviceId={room.temperatureDeviceId}
            co2DeviceId={airQualityDeviceId}
          />
        )}

        <AirQualitySection readings={readings} overallStatus={overallStatus} />

        <LightsSection lightState={lightState} />

        {room.speakerDeviceId && (
          <SpeakerSection
            deviceId={room.speakerDeviceId}
            flows={room.speakerFlows}
          />
        )}
      </div>
    </div>
  );
};
