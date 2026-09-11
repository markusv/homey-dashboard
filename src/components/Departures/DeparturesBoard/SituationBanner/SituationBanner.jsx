import React from "react";

export const SituationBanner = ({ message, onDismiss }) => {
  if (!message) {
    return null;
  }
  return (
    <div
      className="departures-situation-overlay"
      onClick={onDismiss}
      role="presentation"
    >
      <div
        className="departures-situation-popover"
        role="dialog"
        aria-label="Trafikkmelding"
        onClick={(event) => event.stopPropagation()}
      >
        <span className="departures-situation-icon" aria-hidden="true">
          !
        </span>
        <p className="departures-situation-text">{message}</p>
      </div>
    </div>
  );
};
