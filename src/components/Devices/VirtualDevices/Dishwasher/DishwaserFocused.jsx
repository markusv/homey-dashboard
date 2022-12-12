import React from "react";
import "./dishwasher.css";
import { SlButton } from "@shoelace-style/shoelace/dist/react";

export const DishwasherFocused = ({ dishwasherDevice }) => {
  const onStartNightClick = () => {};
  const onStartDayClick = () => {};
  return (
    <div className="entrance-focused-container">
      <div>
        <img
          className="dishwasher-focused-icon-image"
          src={`https://icons-cdn.athom.com/${dishwasherDevice.iconObj.id}-128.png`}
        />
      </div>
      <div className="dishwasher-focused-content">
        <SlButton
          size="large"
          className="dishwasher-focused-buttton"
          onClick={onStartNightClick}
        >
          Start eco program i løpet av natten
        </SlButton>
        <SlButton
          size="large"
          className="dishwasher-focused-buttton"
          onClick={onStartDayClick}
        >
          Start eco program i løpet av dagen
        </SlButton>
      </div>
    </div>
  );
};
