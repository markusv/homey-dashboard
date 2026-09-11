import React from "react";
import classNames from "classnames";

export const AirQualitySummary = ({ readings, compact = false }) => {
  if (!readings?.length) return null;

  return (
    <div
      className={classNames("andre-air-summary", {
        "andre-air-summary--compact": compact,
      })}
      aria-label="Luftkvalitet"
    >
      {readings.map((reading) => (
        <div
          key={reading.capability}
          className={classNames(
            "andre-air-summary-item",
            `andre-air-summary-item--${reading.status}`
          )}
        >
          <span className="andre-air-summary-label">{reading.label}</span>
          <span className="andre-air-summary-value">
            {reading.display}
            <span className="andre-air-summary-unit">{reading.unit}</span>
          </span>
        </div>
      ))}
    </div>
  );
};
