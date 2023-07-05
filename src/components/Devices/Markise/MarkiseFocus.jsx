import React from "react";
import { SlButton } from "@shoelace-style/shoelace/dist/react";
import { setOpenPercentage } from "./helpers/setOpenPercentage";
import "./markise.css";

export const MarkiseFocus = ({ markiseDevice }) => {
  const set0 = () => {
    setOpenPercentage(markiseDevice, 0);
  };
  const set25 = () => {
    setOpenPercentage(markiseDevice, 0.25);
  };
  const set50 = () => {
    setOpenPercentage(markiseDevice, 0.5);
  };
  const set100 = () => {
    setOpenPercentage(markiseDevice, 1);
  };

  return (
    <div className="markise-focused-container">
      <div>
        <img
          className="markise-focused-icon-image"
          src={`https://icons-cdn.athom.com/${markiseDevice.iconObj.id}-128.png`}
        />
      </div>
      <div className="markise-focused-content">
        <SlButton
          size="large"
          className="markise-focused-buttton"
          onClick={set0}
        >
          0%
        </SlButton>
        <SlButton
          size="large"
          className="markise-focused-buttton"
          onClick={set25}
        >
          25%
        </SlButton>
        <SlButton
          size="large"
          className="markise-focused-buttton"
          onClick={set50}
        >
          50%
        </SlButton>
        <SlButton
          size="large"
          className="markise-focused-buttton"
          onClick={set100}
        >
          100%
        </SlButton>
      </div>
    </div>
  );
};
