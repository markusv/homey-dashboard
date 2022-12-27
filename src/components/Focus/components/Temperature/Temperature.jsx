import React from "react";
import "./temperature.css";
import * as classnames from "classnames";

export const Temperature = ({ ttemperatureAsInt }) => {
  const classes = classnames("temperature", {
    "temperature--low": ttemperatureAsInt < 0,
    "temperature--high": ttemperatureAsInt > 20,
  });
  return <span className={classes}>{ttemperatureAsInt}</span>;
};
