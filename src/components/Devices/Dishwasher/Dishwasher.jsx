import React from "react";
import { useGetDevice } from "../helpers/useGetDevice";
import { Icon } from "../components/Icon";
import { StatusIcon } from "../components/StatusIcon/StatusIcon";
import { useGetLogicVariable } from "../../../helpers/useGetLogicVariable";
import { triggerFlow } from "../../Flows/helpers/triggerFlow";
import {
  DISHWASHER_DELAYED_START_FLOW_ID,
  DISHWASHER_DELAYED_START_VARIABLE_ID,
  DISHWASHER_DEVICE_ID,
} from "../../../constants";

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
