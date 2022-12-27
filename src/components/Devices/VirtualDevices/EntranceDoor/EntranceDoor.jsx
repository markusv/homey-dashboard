import React from "react";
import { useGetDevice } from "../../helpers/useGetDevice";
import { SvgIcon } from "../../components/SvgIcon";
import { StatusIndicator } from "../../components/StatusIndicator/StatusIndicator";
import { useMakeCapabilityInstance } from "../../helpers/useMakeCapabilityInstance";
import { EntranceDoorFocused } from "./EntranceDoorFocused";
import { FocusedElement } from "../../../Focus/FocusedElement/FocusedElement";

const ENTRANCE_DOOR_SENSOR_ID = "6dffa047-b727-4b79-956b-1309f7492f66";
export const ENTRANCE_DOOR_LOCK_DEVICE = "b65fe2ba-b0fc-4f85-8622-a1e27b814cac";

export const EntranceDoor = ({ onClick }) => {
  const [entranceDoorSensorDevice, setEntranceDoorSensorDevice] = useGetDevice(
    ENTRANCE_DOOR_SENSOR_ID
  );
  const [entranceDoorLockDevice] = useGetDevice(ENTRANCE_DOOR_LOCK_DEVICE);

  useMakeCapabilityInstance(
    entranceDoorSensorDevice,
    setEntranceDoorSensorDevice,
    "alarm_contact"
  );

  const onDeviceClick = async () => {
    if (onClick) {
      onClick({
        id: "entranceDoor",
        render: (close) => {
          return (
            <FocusedElement title="Inngangsdør" onCloseClick={close}>
              <EntranceDoorFocused
                entranceDoorLockDevice={entranceDoorLockDevice}
              />
            </FocusedElement>
          );
        },
      });
    }
  };

  const isOpen =
    entranceDoorSensorDevice?.capabilitiesObj?.["alarm_contact"]?.value ??
    false;

  return (
    <div className="device" onClick={onDeviceClick}>
      <SvgIcon url="https://my.homey.app/img/devices/door.svg" />
      {isOpen && <StatusIndicator />}
      <div className="device-content">Inngangsdør</div>
    </div>
  );
};
