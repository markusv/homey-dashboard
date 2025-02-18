import React from "react";
import { Moods } from "../../../components/Moods/Moods";
import { useGetFlows } from "../../../helpers/useGetFlows";
import { ENTRE_MOODS } from "../constants";
import "./Dashboard.css";
import { Card } from "./Card/Card";
import { getHomey } from "../../../helpers/getHomey";
import { useGetDevice } from "../../../components/Devices/helpers/useGetDevice";
import {
  GARAGE_OPENER_ID,
  GARAGE_SENSOR_DEVICE_ID,
  ROBOROCK_STUE_CLEAN_ALL_ROOMS__FLOW_ID,
  ROBOROCK_STUE_DEVICE_ID,
} from "../../../constants";
import { useMakeCapabilityInstance } from "../../../components/Devices/helpers/useMakeCapabilityInstance";
import { EntranceDoorCard } from "./EntranceDoorCard";
import { triggerFlow } from "../../../components/Flows/helpers/triggerFlow";

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

  const roborockCleanAllRooms = () => {
    triggerFlow(ROBOROCK_STUE_CLEAN_ALL_ROOMS__FLOW_ID);
  };

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
        <EntranceDoorCard />

        <Card
          title="Roborock"
          className="entrance-roborock-card"
          svgIconUrl="https://icons-cdn.athom.com/118bd02ed9ac707e812cb10e830139cd-128.png"
          onClick={roborockCleanAllRooms}
        />
      </div>
    </div>
  );
};
