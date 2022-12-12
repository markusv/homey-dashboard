import React from "react";
import { useGetFlow } from "./helpers/useGetFlow";
import { triggerFlow } from "./helpers/triggerFlow";

export const Flow = ({ flowId }) => {
  const [homeyFlow] = useGetFlow(flowId);
  if (!homeyFlow) {
    return null;
  }

  const onFlowClick = async () => {
    await triggerFlow(homeyFlow.id);
  };

  return (
    <div className="flow" onClick={onFlowClick}>
      <div className="flow-play"></div>
      {homeyFlow.name}
    </div>
  );
};
