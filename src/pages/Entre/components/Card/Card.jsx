import React from "react";
import "./Card.css";
import { SvgIcon } from "../../../../components/Devices/components/SvgIcon";
import { SlButton } from "@shoelace-style/shoelace/dist/react";
import { StatusIndicator } from "../../../../components/Devices/components/StatusIndicator/StatusIndicator";

export const Card = ({
  title,
  svgIconUrl,
  actions = [],
  onClick,
  className,
  statusIndicator,
}) => {
  return (
    <div className={`${className} entre-card`} onClick={onClick}>
      {svgIconUrl && <SvgIcon url={svgIconUrl} />}
      {statusIndicator && <StatusIndicator />}
      <div className="entre-card-content">
        <h2 className="entre-card-title">{title}</h2>
        {actions.map((action) => {
          return (
            <SlButton
              key={`card-${action.id}`}
              size="large"
              className="entrance-focused-buttton"
              onClick={action.onClick}
            >
              {action.title}
            </SlButton>
          );
        })}
      </div>
    </div>
  );
};
