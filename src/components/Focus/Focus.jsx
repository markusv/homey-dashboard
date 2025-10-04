import React from "react";
import "./focus.css";
import { FocusTemperature } from "./FocusTemperature";
import { ErrorBoundary } from "../ErrorBoundary";
import { Weather } from "../Weather/Weather";

export const Focus = ({ onSetFocus }) => {
  return (
    <div className="focus-container">
      <div className="focus-left">
        <FocusTemperature />
      </div>
      <div className="focus-right">
        <ErrorBoundary>
          <Weather onSetFocus={onSetFocus} className="focus-weather" />
        </ErrorBoundary>
      </div>
    </div>
  );
};
