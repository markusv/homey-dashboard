import { Icon } from "../components/Icon";
import React from "react";
import { useGetDevice } from "../helpers/useGetDevice";
import { useMakeCapabilityInstance } from "../helpers/useMakeCapabilityInstance";
import { SonosFocus } from "./SonosFocus";
import "./sonos.css";

export const SONOS_KITCHEN_ID = "ac98800b-cc10-4d6d-816e-9d8c320593b4";

export const Sonos = ({ onClick }) => {
  const [sonosKitchen, setSonosKitchen] = useGetDevice(SONOS_KITCHEN_ID);
  useMakeCapabilityInstance(sonosKitchen, setSonosKitchen, "speaker_album");
  const onDeviceClick = () => {
    if (onClick) {
      onClick(
        {
          id: "sonos",
          render: (close) => {
            return <SonosFocus close={close} />;
          },
        },
        false
      );
    }
  };
  return (
    <div className="device" onClick={onDeviceClick}>
      <Icon homeyDevice={sonosKitchen} />
      <div className="device-content">Høyttaler</div>
    </div>
  );
};
