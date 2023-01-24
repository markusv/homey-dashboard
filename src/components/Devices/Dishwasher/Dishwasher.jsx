import React from "react";
import { useGetDevice } from "../helpers/useGetDevice";
import { Icon } from "../components/Icon";
import { StatusIcon } from "../components/StatusIcon/StatusIcon";
import { useGetLogicVariable } from "../../../helpers/useGetLogicVariable";
import { DISHWASHER_DELAYED_START_VARIABLE_ID } from "./constants";
import { triggerFlow } from "../../Flows/helpers/triggerFlow";

const DISHWASHER_DEVICE_ID = "9c89613c-c969-4649-9f52-a95b5999017d";
const DISHWASHER_DELAYED_START_FLOW_ID = "f6334071-ed8e-46c6-88c2-546fc348e97f";

export const Dishwasher = () => {
  const [delayedStart] = useGetLogicVariable(
    DISHWASHER_DELAYED_START_VARIABLE_ID
  );
  const [dishwasherDevice] = useGetDevice(DISHWASHER_DEVICE_ID);

  const onDeviceClick = async () => {
    await triggerFlow(DISHWASHER_DELAYED_START_FLOW_ID);
  };

  return (
    <div className="device" onClick={onDeviceClick}>
      <Icon homeyDevice={dishwasherDevice} />
      {delayedStart?.value && <StatusIcon iconName="clock-history" />}
      <div className="device-content">Oppvaskmaskin</div>
    </div>
  );
};
