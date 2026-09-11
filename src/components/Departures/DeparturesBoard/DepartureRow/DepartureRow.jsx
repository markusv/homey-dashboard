import React from "react";
import {
  formatDepartureCountdown,
  getLineBadgeClassName,
} from "../DeparturesBoard.helpers";

export const DepartureRow = ({
  departure,
  now,
  isSituationOpen,
  onToggleSituation,
}) => {
  const countdown = formatDepartureCountdown(departure.expectedTime, now);
  const situation = (departure.situations || []).join(" · ");

  return (
    <div className="departures-row">
      <span className={getLineBadgeClassName(departure.line)}>
        {departure.line}
      </span>
      <div className="departures-row-time">
        <div className="departures-row-countdown">
          <span className="departures-row-minutes">
            {countdown.minutesLabel}
          </span>
          {countdown.unitLabel ? (
            <span className="departures-row-unit">{countdown.unitLabel}</span>
          ) : null}
        </div>
        <span className="departures-row-clock">{countdown.clockLabel}</span>
      </div>
      <div className="departures-row-destination">{departure.destination}</div>
      {situation ? (
        <button
          type="button"
          className={`departures-situation-trigger${
            isSituationOpen ? " departures-situation-trigger--open" : ""
          }`}
          aria-expanded={isSituationOpen}
          aria-label="Trafikkmelding"
          onClick={onToggleSituation}
        >
          !
        </button>
      ) : (
        <span
          className="departures-situation-trigger-spacer"
          aria-hidden="true"
        />
      )}
    </div>
  );
};
