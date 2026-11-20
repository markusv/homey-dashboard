import React from "react";
import "./roborock.css";
import { triggerFlow } from "../../Flows/helpers/triggerFlow";
import { getHomey } from "../../../helpers/getHomey";
import { useGetDevice } from "../helpers/useGetDevice";
import {
  ROBOROCK_STUE_CLEAN_ALL_ROOMS__FLOW_ID,
  ROBOROCK_STUE_CLEAN_ENTRE_FLOW_ID,
  ROBOROCK_STUE_CLEAN_KITCHEN_FLOW_ID,
  ROBOROCK_STUE_CLEAN_STUE_FLOW_ID,
  ROBOROCK_STUE_DEVICE_ID,
} from "../../../constants";
import { ROBOROCK_RETURN_TO_DOCK_CAPABILITY_ID } from "./constants";
import { getRoborockVisualState } from "./helpers/getRoborockVisualState";
import { useRoborockLiveState } from "./hooks/useRoborockLiveState";
import { RoborockScene } from "./RoborockScene/RoborockScene";

const ROOMS = [
  { label: "Stue", flowId: ROBOROCK_STUE_CLEAN_STUE_FLOW_ID },
  {
    label: "Kjøkken og Spisestue",
    flowId: ROBOROCK_STUE_CLEAN_KITCHEN_FLOW_ID,
  },
  { label: "Entre", flowId: ROBOROCK_STUE_CLEAN_ENTRE_FLOW_ID },
  { label: "Alle", flowId: ROBOROCK_STUE_CLEAN_ALL_ROOMS__FLOW_ID },
];

const DockIcon = () => (
  <svg
    className="roborock-dock-icon"
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M4 11.2 12 5l8 6.2V20h-5.2v-5.2H9.2V20H4Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
);

export const RoborockFocus = () => {
  const [device, setDevice] = useGetDevice(ROBOROCK_STUE_DEVICE_ID);
  useRoborockLiveState(device, setDevice);
  const visual = getRoborockVisualState(device);

  const returnToDock = async () => {
    if (!device?.id) return;
    const homeyApi = await getHomey();
    await homeyApi.devices
      .setCapabilityValue({
        deviceId: device.id,
        capabilityId: ROBOROCK_RETURN_TO_DOCK_CAPABILITY_ID,
        value: true,
      })
      .catch(console.error);
  };

  return (
    <div className="roborock-focused-container">
      <RoborockScene scene={visual.scene} status={visual.status} />
      <div className="roborock-actions">
        {visual.showDockButton && (
          <button
            type="button"
            className="roborock-action roborock-action--dock"
            onClick={returnToDock}
          >
            <DockIcon />
            Til dock
          </button>
        )}
        {ROOMS.map((room) => (
          <button
            key={room.flowId}
            type="button"
            className="roborock-action"
            onClick={() => triggerFlow(room.flowId)}
          >
            {room.label}
          </button>
        ))}
      </div>
    </div>
  );
};
