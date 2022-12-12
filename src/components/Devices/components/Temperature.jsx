import React from "react";

export const Temperature = ({ device }) => {
  return (
    <div className="device-temperature">{`${device.capabilitiesObj.measure_temperature.value} ${device.capabilitiesObj.measure_temperature.units}`}</div>
  );
};
