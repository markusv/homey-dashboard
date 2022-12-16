import React from "react";
import { useGetDevice } from "../helpers/useGetDevice";
import { Icon } from "../components/Icon";
import { FocusedElement } from "../../Focus/FocusedElement/FocusedElement";
import { DishwasherFocused } from "./DishwaserFocused";
import { StatusIcon } from "../components/StatusIcon/StatusIcon";
import { useGetLogicVariable } from "../../../helpers/useGetLogicVariable";
import { DISHWASHER_DELAYED_START_VARIABLE_ID } from "./constants";

const DISHWASHER_DEVICE_ID = "9c89613c-c969-4649-9f52-a95b5999017d";

export const Dishwasher = ({ onClick }) => {
  const [delayedStart] = useGetLogicVariable(
    DISHWASHER_DELAYED_START_VARIABLE_ID
  );
  const [dishwasherDevice] = useGetDevice(DISHWASHER_DEVICE_ID);

  const onDeviceClick = async () => {
    if (onClick) {
      onClick({
        id: "dishwasher",
        render: (close) => {
          return (
            <FocusedElement title="Oppvaskmaskin" onCloseClick={close}>
              <DishwasherFocused dishwasherDevice={dishwasherDevice} />
            </FocusedElement>
          );
        },
      });
    }
  };

  return (
    <div className="device" onClick={onDeviceClick}>
      <Icon homeyDevice={dishwasherDevice} />
      {delayedStart?.value && <StatusIcon iconName="clock-history" />}
      <div className="device-content">Oppvaskmaskin</div>
    </div>
  );
};
