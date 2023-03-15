import React from "react";
import { Temperature } from "../../Focus/components/Temperature/Temperature";

export const ForecastItem = ({ forecast }) => {
  const temp = forecast?.data?.instant?.details?.air_temperature;
  let data = forecast?.data?.next_1_hours;
  if (!data) data = forecast?.data?.next_6_hours;
  if (!data) data = forecast?.data?.next_12_hours;
  if (!data) {
    return <div className="forecast-item" />;
  }
  return (
    <div className="forecast-item">
      <img
        className="forecast-item--icon"
        alt={data.summary.symbol_code}
        src={
          process.env.PUBLIC_URL +
          `/dashboardAssets/weatherIcons/${data.summary.symbol_code}.svg`
        }
      />
      {temp && <Temperature ttemperatureAsInt={Math.round(temp)} />}
    </div>
  );
};
