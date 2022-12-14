import "./App.css";
import React, { useEffect, useState } from "react";
import "@shoelace-style/shoelace/dist/themes/dark.css";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path";
import { useGetDevices } from "./helpers/useGetDevices";
import { useGetFlows } from "./helpers/useGetFlows";
import { Moods } from "./components/Moods/Moods";
import { Rullegardiner } from "./components/Devices/VirtualDevices/Rullegardiner";
import { Garage } from "./components/Devices/VirtualDevices/Garage/Garage";
import { EntranceDoor } from "./components/Devices/VirtualDevices/EntranceDoor/EntranceDoor";
import { Dishwasher } from "./components/Devices/Dishwasher/Dishwasher";
import { Focus } from "./components/Focus/Focus";
import "./components/Devices/device.css";
import { AudioProSpeaker } from "./components/Devices/AudioProSpeaker/AudioProSpeaker";

setBasePath(
  "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.83/dist/"
);

const AthomCloudAPI = require("homey-api/lib/AthomCloudAPI");

const App = () => {
  const [devices] = useGetDevices();
  //console.log("d", (devices || {})["06d71bbf-5c0b-4aa6-a96a-cce4301fe916"]);
  const [flows] = useGetFlows();
  const [focusElement, setFocusElement] = useState();
  useEffect(() => {
    if (!focusElement) {
      return;
    }
    const timer = setTimeout(clearFocus, focusElement.timer ?? 10000);
    return () => clearTimeout(timer);
  }, [focusElement]);

  if (!flows || !devices) {
    return null;
  }

  const onMoodClick = async (id) => {
    console.log("mood clicked", id);
  };

  const onSetFocus = (obj) => {
    if (obj) {
      setFocusElement(obj);
    }
  };

  const clearFocus = () => {
    if (focusElement) {
      setFocusElement(null);
    }
  };

  return (
    <div className="sl-theme-dark homey-dashboard">
      <div className="first-column">
        <Moods flows={flows} onMoodClick={onMoodClick} />
      </div>
      <div className="second-column">
        <div className="first-row">
          <div className="focus-area">
            {focusElement && focusElement.render(clearFocus)}
            {!focusElement && <Focus onSetFocus={onSetFocus} />}
          </div>
        </div>
        <div className="second-row">
          <Rullegardiner />
          <Garage />
          <EntranceDoor onClick={onSetFocus} />
          <Dishwasher onClick={onSetFocus} />
          <AudioProSpeaker onClick={onSetFocus} />
        </div>
      </div>
    </div>
  );
};

export default App;
