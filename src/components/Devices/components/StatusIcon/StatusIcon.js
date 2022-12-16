import React from "react";
import { SlIcon } from "@shoelace-style/shoelace/dist/react";
import "./statusIcon.css";

export const StatusIcon = ({ iconName }) => (
  <SlIcon name={iconName} className="device-status-icon" />
);
