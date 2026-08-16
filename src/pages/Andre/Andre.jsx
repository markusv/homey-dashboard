import React, { useState } from "react";
import "@shoelace-style/shoelace/dist/themes/dark.css";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path";
import { useGetDevices } from "../../helpers/useGetDevices";
import { useSetDocumentTitle } from "../../helpers/useSetDocumentTitle";
import { rooms } from "./rooms";
import { Clock } from "./components/Clock";
import { WeatherStrip } from "./components/WeatherStrip";
import { RoomCard } from "./components/RoomCard";
import { RoomDetail } from "./components/RoomDetail";
import "./Andre.css";

setBasePath(
  "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.1/cdn/"
);

export const Andre = () => {
  useSetDocumentTitle("Dashboard Risløkkveien 66c - 2. etasje");
  const [devices] = useGetDevices();
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  const selectedRoom = rooms.find((room) => room.id === selectedRoomId);

  if (selectedRoom) {
    return (
      <div className="sl-theme-dark andre-page">
        <RoomDetail
          room={selectedRoom}
          devices={devices}
          onBack={() => setSelectedRoomId(null)}
        />
      </div>
    );
  }

  return (
    <div className="sl-theme-dark andre-page">
      <Clock />
      <WeatherStrip />
      <section className="andre-room-grid" aria-label="Rom">
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            devices={devices}
            onOpen={(nextRoom) => setSelectedRoomId(nextRoom.id)}
          />
        ))}
      </section>
    </div>
  );
};
