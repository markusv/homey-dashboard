import React from "react";
import { Temperature } from "./Temperature";

export const TemperatureRange = ({
  temperatureOneAsInt,
  temperatureTwoAsInt,
  className,
}) => {
  return (
    <span className={className}>
      <Temperature ttemperatureAsInt={temperatureOneAsInt} />
      {` / `}
      <Temperature ttemperatureAsInt={temperatureTwoAsInt} />
    </span>
  );
};
