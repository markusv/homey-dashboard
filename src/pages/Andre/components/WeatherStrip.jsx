import React, { useMemo } from "react";
import { useFetchForecast } from "../../../components/Weather/helpers/useFetchForecast";
import { getForecastItemsForDay } from "../../../components/Weather/helpers/getForecastItemsForDay";
import { getNameOfDay } from "../../../components/Weather/helpers/getNameOfDay";

const DAYS_AHEAD = 5;

const getItemsForOffset = (forecast, dayOffset) => {
  const dateForForecast = new Date();
  dateForForecast.setDate(dateForForecast.getDate() + dayOffset);
  const forecastForDay = forecast.filter(
    (entry) => new Date(entry.time).getDate() === dateForForecast.getDate()
  );
  if (!forecastForDay.length) return null;

  const items = getForecastItemsForDay(forecastForDay).filter(Boolean);
  const now = Date.now();

  const points = items
    .filter((item) => {
      if (!item?.time) return false;
      if (
        dayOffset === 0 &&
        new Date(item.time).getTime() < now - 30 * 60 * 1000
      ) {
        return false;
      }
      return Boolean(
        item.data?.next_1_hours ||
        item.data?.next_6_hours ||
        item.data?.next_12_hours
      );
    })
    .map((item) => {
      const period =
        item.data?.next_1_hours ||
        item.data?.next_6_hours ||
        item.data?.next_12_hours;
      const temp = item.data?.instant?.details?.air_temperature;
      return {
        key: item.time,
        symbol: period?.summary?.symbol_code,
        temperature: typeof temp === "number" ? Math.round(temp) : null,
      };
    });

  if (!points.length) return null;

  return {
    dayOffset,
    dayLabel: getNameOfDay(dateForForecast),
    points,
  };
};

export const WeatherStrip = () => {
  const [forecast] = useFetchForecast();

  const days = useMemo(() => {
    if (!forecast?.length) return [];
    const collected = [];
    for (let offset = 0; offset < DAYS_AHEAD; offset += 1) {
      const day = getItemsForOffset(forecast, offset);
      if (day) collected.push(day);
    }
    return collected;
  }, [forecast]);

  if (!days.length) {
    return (
      <div className="andre-weather andre-weather--empty">Laster vær…</div>
    );
  }

  return (
    <div className="andre-weather" role="region" aria-label="Værmelding">
      <div className="andre-weather-track">
        {days.map((day) => (
          <div key={day.dayOffset} className="andre-weather-day">
            <div className="andre-weather-day-label">{day.dayLabel}</div>
            <div className="andre-weather-day-points">
              {day.points.map((item) => (
                <div key={item.key} className="andre-weather-item">
                  {item.symbol && (
                    <img
                      className="andre-weather-item-icon"
                      alt={item.symbol}
                      src={`${import.meta.env.BASE_URL}dashboardAssets/weatherIcons/${item.symbol}.svg`}
                    />
                  )}
                  {item.temperature != null && (
                    <div className="andre-weather-item-temp">
                      {item.temperature}°
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
