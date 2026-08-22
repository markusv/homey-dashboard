import React from "react";
import { SlButton } from "@shoelace-style/shoelace/dist/react";
import { useLiveRoomLights } from "../helpers/useLiveRoomLights";
import { useLiveRoomBlinds } from "../helpers/useLiveRoomBlinds";
import { useLiveAirQuality } from "../helpers/useLiveAirQuality";
import { FlowsSection } from "./FlowsSection";
import { TemperatureSection } from "./TemperatureSection";
import { AirQualitySection } from "./AirQualitySection";
import { LightsSection } from "./LightsSection";
import { SpeakerSection } from "./SpeakerSection";

export const RoomDetail = ({ room, devices, zones, onBack }) => {
  const lightState = useLiveRoomLights(devices, room, zones);
  const blindState = useLiveRoomBlinds(devices, room);
  const {
    deviceId: airQualityDeviceId,
    readings,
    overallStatus,
  } = useLiveAirQuality(devices, room);

  return (
    <div className="andre-room-detail">
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
          lightState={lightState}
          blindState={blindState}
        />

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
