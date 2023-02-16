import React from "react";
import { Mood } from "./Mood";
import "./moods.css";

export const Moods = ({ flows, moods, onMoodClick }) => {
  return (
    <div className="moods-container">
      <h2 className="moods-header">Stemninger</h2>
      {Object.entries(moods).map(([key, value]) => {
        const flow = flows[value.id];
        return flow ? (
          <Mood
            key={`mood-id-${flow.id}`}
            flow={flow}
            onClick={onMoodClick}
            title={value.title ?? flow.name}
            icon={value.icon}
          />
        ) : null;
      })}
    </div>
  );
};
