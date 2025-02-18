import React from "react";
import { SlButton } from "@shoelace-style/shoelace/dist/react";
import "./roborock.css";
import { triggerFlow } from "../../Flows/helpers/triggerFlow";
import {
  ROBOROCK_STUE_CLEAN_ALL_ROOMS__FLOW_ID,
  ROBOROCK_STUE_CLEAN_ENTRE_FLOW_ID,
  ROBOROCK_STUE_CLEAN_KITCHEN_FLOW_ID,
  ROBOROCK_STUE_CLEAN_STUE_FLOW_ID,
} from "../../../constants";

export const RoborockFocus = ({ roborockDevice }) => {
  const cleanStue = () => {
    triggerFlow(ROBOROCK_STUE_CLEAN_STUE_FLOW_ID);
  };

  const cleanKitchenSpisestue = () => {
    triggerFlow(ROBOROCK_STUE_CLEAN_KITCHEN_FLOW_ID);
  };
  const cleanEntre = () => {
    triggerFlow(ROBOROCK_STUE_CLEAN_ENTRE_FLOW_ID);
  };
  const cleanAll = () => {
    triggerFlow(ROBOROCK_STUE_CLEAN_ALL_ROOMS__FLOW_ID);
  };

  return (
    <div className="roborock-focused-container">
      <div>
        <img
          className="roborock-focused-icon-image"
          src={`https://icons-cdn.athom.com/${roborockDevice.iconObj.id}-128.png`}
        />
      </div>
      <div className="roborock-focused-content">
        <SlButton
          size="large"
          className="roborock-focused-buttton"
          onClick={cleanStue}
        >
          Stue
        </SlButton>
        <SlButton
          size="large"
          className="roborock-focused-buttton"
          onClick={cleanKitchenSpisestue}
        >
          Kjøkken og Spisestue
        </SlButton>
        <SlButton
          size="large"
          className="roborock-focused-buttton"
          onClick={cleanEntre}
        >
          Entre
        </SlButton>
        <SlButton
          size="large"
          className="roborock-focused-buttton"
          onClick={cleanAll}
        >
          Alle
        </SlButton>
      </div>
    </div>
  );
};
