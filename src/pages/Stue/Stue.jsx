import "../../App.css";
import React, { useEffect, useState } from "react";
import "@shoelace-style/shoelace/dist/themes/dark.css";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path";
import { useGetDevices } from "../../helpers/useGetDevices";
import { useGetFlows } from "../../helpers/useGetFlows";
import { Moods } from "../../components/Moods/Moods";
import { Rullegardiner } from "../../components/Devices/VirtualDevices/Rullegardiner";
import { Garage } from "../../components/Devices/VirtualDevices/Garage/Garage";
import { EntranceDoor } from "../../components/Devices/VirtualDevices/EntranceDoor/EntranceDoor";
import { Dishwasher } from "../../components/Devices/Dishwasher/Dishwasher";
import { Focus } from "../../components/Focus/Focus";
import "../../components/Devices/device.css";
import { STUE_MOODS } from "./constants";
import { useSetDocumentTitle } from "../../helpers/useSetDocumentTitle";
import { Markise } from "../../components/Devices/Markise/Markise";
import { Roborock } from "../../components/Devices/Roborock/Roborock";
import { Sonos } from "../../components/Devices/Sonos/Sonos";
import { RINGEKLOKKE_BILDE_URL_VARIABLE } from "../../constants";
import { useGetLogicVariable } from "../../helpers/useGetLogicVariable";
import { ImageFocus } from "../../components/ImageFocus/ImageFocus";

setBasePath(
  "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.83/dist/"
);

const AthomCloudAPI = require("homey-api/lib/AthomCloudAPI");

export const Stue = () => {
  const [devices] = useGetDevices();
  useSetDocumentTitle("Dahboard Risløkkveien 66c - Stue");
  const [flows] = useGetFlows();
  const [focusElement, setFocusElement] = useState();
  const [autoClearFocus, setAutoClearFocus] = useState(true);
  useEffect(() => {
    if (!focusElement || !autoClearFocus) {
      return;
    }
    const timer = setTimeout(clearFocus, focusElement.timer ?? 10000);
    return () => clearTimeout(timer);
  }, [focusElement]);

  const onSetFocus = (obj, clearFocusAutomaitcally) => {
    if (!obj) {
      return;
    }

    setFocusElement(obj);
    setAutoClearFocus(
      typeof clearFocusAutomaitcally === "boolean"
        ? clearFocusAutomaitcally
        : true
    );
  };

  const clearFocus = () => {
    if (focusElement) {
      setFocusElement(null);
    }
  };

  const [initialized, setInitialized] = useState(false);
  const [imageUrlVariable] = useGetLogicVariable(
    RINGEKLOKKE_BILDE_URL_VARIABLE
  );
  const imageUrl = imageUrlVariable?.value ?? "";
  useEffect(() => {
    if (imageUrl && initialized) {
      onSetFocus(
        {
          id: "sonos",
          timer: 20000,
          render: (close) => {
            return <ImageFocus close={close} imageSrc={imageUrl} />;
          },
        },
        true
      );
    }
    if (imageUrl && !initialized) setInitialized(true);
  }, [imageUrl]);

  if (!flows || !devices) {
    return null;
  }

  const onMoodClick = async (id) => {
    console.log("mood clicked", id);
  };

  return (
    <div className="sl-theme-dark homey-dashboard">
      <div className="first-column">
        <Moods flows={flows} moods={STUE_MOODS} onMoodClick={onMoodClick} />
      </div>
      <div className="second-column">
        <div className="first-row">
          <div className="focus-area">
            {focusElement && focusElement.render(clearFocus)}
            {!focusElement && <Focus onSetFocus={onSetFocus} />}
          </div>
        </div>
        <div className="second-row">
          <Dishwasher onClick={onSetFocus} />
          <Roborock onClick={onSetFocus} />
          <Sonos onClick={onSetFocus} />
          <Rullegardiner />
          <Markise onClick={onSetFocus} />
          <Garage />
          <EntranceDoor onClick={onSetFocus} />
        </div>
      </div>
    </div>
  );
};
