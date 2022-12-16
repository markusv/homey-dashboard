import React from "react";
import { Temperature } from "./Temperature";

export const TemperatureRange = ({
  temperatureOneAsInt,
  temperatureTwoAsInt,
}) => {
  return (
    <>
      <Temperature ttemperatureAsInt={temperatureOneAsInt} />
      {` / `}
      <Temperature ttemperatureAsInt={temperatureTwoAsInt} />
    </>
  );
};
