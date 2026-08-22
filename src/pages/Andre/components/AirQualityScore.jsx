import React from "react";
import classNames from "classnames";
import { AIR_QUALITY_STATUS_LABELS } from "../helpers/airQualityMetrics";

export const AirQualityScore = ({ status, compact = false }) => {
  if (!status) return null;

  return (
    <div
      className={classNames(
        "andre-air-score",
        `andre-air-score--${status}`,
        compact && "andre-air-score--compact"
      )}
      aria-label={`Luftkvalitet: ${AIR_QUALITY_STATUS_LABELS[status]}`}
    >
      <span className="andre-air-score-dot" aria-hidden="true" />
      <span className="andre-air-score-label">
        {AIR_QUALITY_STATUS_LABELS[status]}
      </span>
    </div>
  );
};
