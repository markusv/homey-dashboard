import React, { useState } from "react";
import "@shoelace-style/shoelace/dist/themes/dark.css";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path";
import { useGetDevices } from "../../helpers/useGetDevices";
import { useGetZones } from "../../helpers/useGetZones";
import { useSetDocumentTitle } from "../../helpers/useSetDocumentTitle";
import { rooms, overviewActions } from "./rooms.constants";
import { Clock } from "./Clock/Clock";
import { WeatherStrip } from "./WeatherStrip/WeatherStrip";
import { RoomCard } from "./RoomCard/RoomCard";
import { RoomDetail } from "./RoomDetail/RoomDetail";
import { OverviewActions } from "./OverviewActions/OverviewActions";
import { WeatherOverlay } from "../../components/Weather/WeatherOverlay/WeatherOverlay";
import "./Andre.css";

setBasePath(
  "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.1/cdn/"
);

export const Andre = () => {
  useSetDocumentTitle("Dashboard Risløkkveien 66c - 2. etasje");
  const [devices] = useGetDevices();
  const [zones] = useGetZones();
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  const selectedRoom = rooms.find((room) => room.id === selectedRoomId);

  const openRoom = (nextRoom) => {
    // Avoid aria-hidden warning: room card must not keep focus under a hidden ancestor.
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setSelectedRoomId(nextRoom.id);
  };

  return (
    <div className="sl-theme-dark andre-shell">
      <WeatherOverlay dimmed={Boolean(selectedRoom)} />
      {/* Keep overview mounted so temperatures/lights stay warm when returning */}
      <div
        className="andre-page andre-page--overview"
        hidden={Boolean(selectedRoom)}
        inert={selectedRoom ? true : undefined}
      >
        <Clock />
        <WeatherStrip />
        <div className="andre-overview-main">
          <section className="andre-room-grid" aria-label="Rom">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                devices={devices}
                zones={zones}
                onOpen={openRoom}
              />
            ))}
          </section>
          <OverviewActions actions={overviewActions} />
        </div>
      </div>

      {selectedRoom && (
        <div className="andre-page andre-page--detail">
          <RoomDetail
            room={selectedRoom}
            devices={devices}
            zones={zones}
            onBack={() => setSelectedRoomId(null)}
          />
        </div>
      )}
    </div>
  );
};
