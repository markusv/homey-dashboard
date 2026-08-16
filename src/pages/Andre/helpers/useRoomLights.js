import { useMemo } from "react";
import { getRoomLights } from "./getRoomLights";

export const useRoomLights = (devices, room) =>
  useMemo(() => getRoomLights(devices, room), [devices, room]);
