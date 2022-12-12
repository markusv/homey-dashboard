import React from "react";
import { SlButton } from "@shoelace-style/shoelace/dist/react";
import { triggerFlow } from "../Flows/helpers/triggerFlow";

export const Mood = ({ flow, onClick }) => {
  const onMoodClick = async () => {
    await triggerFlow(id);
    onClick(flow.id);
  };
  return (
    <div className="mood" onClick={onMoodClick}>
      <SlButton size="large" className="mood-button">
        {flow.name}
      </SlButton>
    </div>
  );
};
