import React from "react";
import "./temperature.css";
import * as classnames from "classnames";

export const Temperature = ({ ttemperatureAsInt }) => {
  const classes = classnames("temperature", {
    "temperature--negative": ttemperatureAsInt < 0,
    "temperature--positive": ttemperatureAsInt > 20,
  });
  return <span className={classes}>{ttemperatureAsInt}</span>;
};
