import React from "react";

export const ForecastItem = ({ forecast }) => {
  let data = forecast?.data?.next_1_hours;
  if (!data) data = forecast?.data?.next_6_hours;
  if (!data) data = forecast?.data?.next_12_hours;
  if (!data) {
    return <div className="forecast-item" />;
  }
  return (
    <div className="forecast-item">
      <img
        src={
          process.env.PUBLIC_URL +
          `/dashboardAssets/weatherIcons/${data.summary.symbol_code}.svg`
        }
      />
    </div>
  );
};
