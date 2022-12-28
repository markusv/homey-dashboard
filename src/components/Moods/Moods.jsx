import React from "react";
import FlowIds from "./constants";
import { Mood } from "./Mood";
import "./moods.css";

export const Moods = ({ flows, onMoodClick }) => {
  return (
    <div className="moods-container">
      <h2 className="moods-header">Stemninger</h2>
      {Object.entries(FlowIds).map(([key, value]) => {
        const flow = flows[value.id];
        return flow ? (
          <Mood
            key={`mood-id-${flow.id}`}
            flow={flow}
            onClick={onMoodClick}
            title={value.title ?? flow.name}
          />
        ) : null;
      })}
    </div>
  );
};
