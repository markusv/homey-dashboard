import React from "react";
import classNames from "classnames";

import { AirQualityScore } from "./AirQualityScore";

export const AirQualitySection = ({ readings, overallStatus }) => {
  if (!readings?.length) return null;

  return (
    <section className="andre-section">
      <div className="andre-air-section-header">
        <h2 className="andre-section-title">Luftkvalitet</h2>
        <AirQualityScore status={overallStatus} />
      </div>
      <div className="andre-air-grid">
        {readings.map((reading) => (
          <article
            key={reading.capability}
            className={classNames(
              "andre-air-tile",
              `andre-air-tile--${reading.status}`
            )}
          >
            <div className="andre-air-tile-label">{reading.label}</div>
            <div className="andre-air-tile-value">
              {reading.display}
              <span className="andre-air-tile-unit">{reading.unit}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
