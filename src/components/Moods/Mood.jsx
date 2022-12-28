import React from "react";
import { SlButton } from "@shoelace-style/shoelace/dist/react";
import { triggerFlow } from "../Flows/helpers/triggerFlow";

export const Mood = ({ flow, title, onClick }) => {
  const onMoodClick = async () => {
    await triggerFlow(flow.id);
    onClick(flow.id);
  };
  return (
    <div className="mood" onClick={onMoodClick}>
      <SlButton size="large" className="mood-button">
        {title}
      </SlButton>
    </div>
  );
};
