import React from "react";
import "./dishwasher.css";
import { SlButton } from "@shoelace-style/shoelace/dist/react";
import { useGetLogicVariable } from "../../../helpers/useGetLogicVariable";
import { triggerFlow } from "../../Flows/helpers/triggerFlow";
import {
  DISHWASHER_DELAYED_START_FLOW_ID,
  DISHWASHER_DELAYED_START_VARIABLE_ID,
} from "../../../constants";

export const DishwasherFocused = ({ dishwasherDevice }) => {
  const [delayedStart] = useGetLogicVariable(
    DISHWASHER_DELAYED_START_VARIABLE_ID
  );
  const onDelayedStartClick = async () => {
    await triggerFlow(DISHWASHER_DELAYED_START_FLOW_ID);
  };
  return (
    <div className="entrance-focused-container">
      <div>
        <img
          className="dishwasher-focused-icon-image"
          src={`https://icons-cdn.athom.com/${dishwasherDevice.iconObj.id}-128.png`}
        />
      </div>
      <div className="dishwasher-focused-content">
        {delayedStart?.value && (
          <p>Ok, jeg starter oppvaskmaskinen når strømmen er billig</p>
        )}
        {!delayedStart?.value && (
          <SlButton
            size="large"
            className="dishwasher-focused-buttton"
            onClick={onDelayedStartClick}
          >
            Start oppvaskmaskin når det er billig strøm
          </SlButton>
        )}
      </div>
    </div>
  );
};
