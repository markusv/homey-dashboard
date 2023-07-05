import React from "react";
import { useGetDevice } from "../helpers/useGetDevice";
import { Icon } from "../components/Icon";
import { MARKISE_DEVICE_ID } from "../../../constants";
import { useMakeCapabilityInstance } from "../helpers/useMakeCapabilityInstance";
import { MARKISE_UP_DOWN_CAPABILITY_ID } from "./constants";
import { FocusedElement } from "../../Focus/FocusedElement/FocusedElement";
import { MarkiseFocus } from "./MarkiseFocus";

export const Markise = ({ onClick }) => {
  const [markiseDevice, setMarkiseeDevice] = useGetDevice(MARKISE_DEVICE_ID);
  useMakeCapabilityInstance(
    markiseDevice,
    setMarkiseeDevice,
    MARKISE_UP_DOWN_CAPABILITY_ID
  );

  const onDeviceClick = async () => {
    if (onClick) {
      onClick({
        id: "markiseFocused",
        render: (close) => {
          return (
            <FocusedElement title="Markise" onCloseClick={close}>
              <MarkiseFocus markiseDevice={markiseDevice} />
            </FocusedElement>
          );
        },
      });
    }
  };

  return (
    <div className="device" onClick={onDeviceClick}>
      <Icon homeyDevice={markiseDevice} />
      <div className="device-content">Markise</div>
    </div>
  );
};
