import React from "react";
import "./temperature.css";
import * as classnames from "classnames";

export const Temperature = ({ ttemperatureAsInt, className }) => {
  const classes = classnames("temperature", className, {
    "temperature--low": ttemperatureAsInt <= 0,
    "temperature--high": ttemperatureAsInt > 0,
  });
  return <span className={classes}>{ttemperatureAsInt}</span>;
};
