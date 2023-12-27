import { Card } from "./Card/Card";
import { useGetDevice } from "../../../components/Devices/helpers/useGetDevice";
import {
  ENTRANCE_DOOR_SENSOR_ID,
  ENTRANCE_DOOW_ALWAYS_CLOSED_FLOW_ID,
  ENTRANCE_DOOW_ALWAYS_OPEN_FLOW_ID,
} from "../../../constants";
import { useMakeCapabilityInstance } from "../../../components/Devices/helpers/useMakeCapabilityInstance";
import { triggerFlow } from "../../../components/Flows/helpers/triggerFlow";

export const EntranceDoorCard = () => {
  const [entranceDoorSensorDevice, setEntranceDoorSensorDevice] = useGetDevice(
    ENTRANCE_DOOR_SENSOR_ID
  );
  useMakeCapabilityInstance(
    entranceDoorSensorDevice,
    setEntranceDoorSensorDevice,
    "alarm_contact"
  );

  const entranceDoorIsOpen =
    entranceDoorSensorDevice?.capabilitiesObj?.["alarm_contact"]?.value ??
    false;

  const onAlwaysOpenClick = async () => {
    await triggerFlow(ENTRANCE_DOOW_ALWAYS_OPEN_FLOW_ID);
  };

  const onAlwaysCloseClick = async () => {
    await triggerFlow(ENTRANCE_DOOW_ALWAYS_CLOSED_FLOW_ID);
  };

  return (
    <Card
      title="Inngangsdør"
      svgIconUrl="https://my.homey.app/img/devices/door.svg"
      statusIndicator={entranceDoorIsOpen}
      actions={[
        {
          id: "alwaysOpen",
          title: "Sett alltid åpen",
          onClick: onAlwaysOpenClick,
        },
        {
          id: "alwaysClosed",
          title: "Sett alltid lukket",
          onClick: onAlwaysCloseClick,
        },
      ]}
    />
  );
};
