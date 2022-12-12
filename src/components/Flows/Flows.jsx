import React from "react";
import { Flow } from "./Flow";
import "./flow.css";

export const Flows = ({ flowIds }) => {
  if (!flowIds || flowIds.length === 0) {
    return null;
  }
  return (
    <section>
      <h1>Flows</h1>
      <div className="flows">
        {flowIds.map((flowId) => (
          <Flow key={flowId} flowId={flowId} />
        ))}
      </div>
    </section>
  );
};
