import React from "react";
import { Moods } from "../../../components/Moods/Moods";
import { useGetFlows } from "../../../helpers/useGetFlows";
import { ENTRE_MOODS } from "../constants";
import "./Dashboard.css";
import { Card } from "./Card/Card";
import { getHomey } from "../../../helpers/getHomey";
import { useGetDevice } from "../../../components/Devices/helpers/useGetDevice";
import {
  ENTRANCE_DOOR_SENSOR_ID,
  ENTRANCE_DOOW_ALWAYS_CLOSED_FLOW_ID,
  ENTRANCE_DOOW_ALWAYS_OPEN_FLOW_ID,
  GARAGE_OPENER_ID,
  GARAGE_SENSOR_DEVICE_ID,
  ROBOROCK_STUE_DEVICE_ID,
} from "../../../constants";
import { triggerFlow } from "../../../components/Flows/helpers/triggerFlow";
import { useMakeCapabilityInstance } from "../../../components/Devices/helpers/useMakeCapabilityInstance";
import { useToggleRoborockClean } from "../../../components/Devices/Roborock/useToggleRoborockClean";

export const Dashboard = () => {
  const [flows] = useGetFlows();
  const [garageSensorDevice, setGarageSensorDevice] = useGetDevice(
    GARAGE_SENSOR_DEVICE_ID
  );
  const [garageOpenerDevice] = useGetDevice(GARAGE_OPENER_ID);
  useMakeCapabilityInstance(
    garageSensorDevice,
    setGarageSensorDevice,
    "alarm_contact"
  );

  const [entranceDoorSensorDevice, setEntranceDoorSensorDevice] = useGetDevice(
    ENTRANCE_DOOR_SENSOR_ID
  );
  useMakeCapabilityInstance(
    entranceDoorSensorDevice,
    setEntranceDoorSensorDevice,
    "alarm_contact"
  );

  const [roborockDevice, setRoborockDevice] = useGetDevice(
    ROBOROCK_STUE_DEVICE_ID
  );
  const onToggleRoborockClean = useToggleRoborockClean(
    roborockDevice,
    setRoborockDevice
  );

  const onMoodClick = async (id) => {
    console.log("mood clicked", id);
  };

  const onGarageClick = async () => {
    const homeyApi = await getHomey();
    homeyApi.devices
      .setCapabilityValue({
        deviceId: garageOpenerDevice.id,
        capabilityId: "onoff.output1",
        value: true,
      })
      .catch(console.error);
  };

  const onAlwaysOpenClick = async () => {
    await triggerFlow(ENTRANCE_DOOW_ALWAYS_OPEN_FLOW_ID);
  };

  const onAlwaysCloseClick = async () => {
    await triggerFlow(ENTRANCE_DOOW_ALWAYS_CLOSED_FLOW_ID);
  };

  const entranceDoorIsOpen =
    entranceDoorSensorDevice?.capabilitiesObj?.["alarm_contact"]?.value ??
    false;
  const isGarageDoorOpen =
    garageSensorDevice?.capabilitiesObj?.["alarm_contact"]?.value ?? false;

  return (
    <div className="entre-dash">
      <div className="entre-dash-col-one">
        <Moods flows={flows} moods={ENTRE_MOODS} onMoodClick={onMoodClick} />
      </div>
      <div className="entre-dash-col-two">
        <Card
          title="Garasje"
          svgIconUrl="https://my.homey.app/img/devices/garage-door.svg"
          onClick={onGarageClick}
          className="entrance-garage-card"
          statusIndicator={isGarageDoorOpen}
        />
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

        <Card
          title="Roborock"
          svgIconUrl="https://icons-cdn.athom.com/7d451ec645be45bbbf5a98915e140fe1-128.png"
          onClick={onToggleRoborockClean}
        />
      </div>
    </div>
  );
};
