import React, { useMemo } from "react";
import { useFetchForecast } from "../../../components/Weather/helpers/useFetchForecast";
import { getForecastItemsForDay } from "../../../components/Weather/helpers/getForecastItemsForDay";
import { getNameOfDay } from "../../../components/Weather/helpers/getNameOfDay";
import {
  getWeatherIconUrl,
  getWeatherPeriod,
  getWeatherSymbolLabel,
} from "./WeatherStrip.helpers";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const toDisplayPoint = (entry, { isNow = false } = {}) => {
  const period = getWeatherPeriod(entry);
  const temp = entry.data?.instant?.details?.air_temperature;
  const time = new Date(entry.time);
  return {
    key: entry.time,
    isNow,
    timeLabel: isNow
      ? "NÅ"
      : time.toLocaleTimeString("nb-NO", {
          hour: "2-digit",
          minute: "2-digit",
        }),
    symbol: period?.summary?.symbol_code,
    temperature: typeof temp === "number" ? Math.round(temp) : null,
  };
};

const getRemainingHoursToday = (forecast) => {
  const now = Date.now() - 20 * 60 * 1000;
  const todayDate = new Date().getDate();
  return forecast
    .filter((entry) => new Date(entry.time).getTime() >= now)
    .filter((entry) => new Date(entry.time).getDate() === todayDate)
    .filter((entry) => getWeatherPeriod(entry))
    .map((entry, index) => toDisplayPoint(entry, { isNow: index === 0 }));
};

const getMaxDayOffset = (forecast) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return forecast.reduce((maxOffset, entry) => {
    const date = new Date(entry.time);
    date.setHours(0, 0, 0, 0);
    const offset = Math.round((date.getTime() - today.getTime()) / MS_PER_DAY);
    return offset > maxOffset ? offset : maxOffset;
  }, 0);
};

const getUpcomingForecastDays = (forecast) => {
  const days = [];
  const maxOffset = getMaxDayOffset(forecast);
  for (let offset = 1; offset <= maxOffset; offset += 1) {
    const dateForForecast = new Date();
    dateForForecast.setDate(dateForForecast.getDate() + offset);
    const forecastForDay = forecast.filter(
      (entry) => new Date(entry.time).getDate() === dateForForecast.getDate()
    );
    if (!forecastForDay.length) continue;

    const points = getForecastItemsForDay(forecastForDay)
      .filter(Boolean)
      .filter((item) => getWeatherPeriod(item))
      .map((item) => toDisplayPoint(item));

    if (!points.length) continue;
    days.push({
      dayOffset: offset,
      dayLabel: getNameOfDay(dateForForecast),
      points,
    });
  }
  return days;
};

export const WeatherStrip = () => {
  const [forecast] = useFetchForecast();

  const { current, hourly, days } = useMemo(() => {
    if (!forecast?.length) {
      return { current: null, hourly: [], days: [] };
    }
    const hourlyPoints = getRemainingHoursToday(forecast);
    const first = hourlyPoints[0]
      ? forecast.find((entry) => entry.time === hourlyPoints[0].key)
      : forecast[0];
    const period = getWeatherPeriod(first);
    const temp = first?.data?.instant?.details?.air_temperature;
    const symbol = period?.summary?.symbol_code;

    return {
      current: first
        ? {
            symbol,
            temperature: typeof temp === "number" ? Math.round(temp) : null,
            label: getWeatherSymbolLabel(symbol),
          }
        : null,
      hourly: hourlyPoints.slice(1),
      days: getUpcomingForecastDays(forecast),
    };
  }, [forecast]);

  if (!current) {
    return (
      <div className="andre-weather andre-weather--empty andre-glass">
        Laster vær…
      </div>
    );
  }

  return (
    <div
      className="andre-weather andre-glass"
      role="region"
      aria-label="Værmelding"
    >
      <div className="andre-weather-now">
        {current.symbol && (
          <img
            className="andre-weather-now-icon"
            alt={current.label}
            src={getWeatherIconUrl(current.symbol)}
          />
        )}
        <div className="andre-weather-now-text">
          {current.temperature != null && (
            <div className="andre-weather-now-temp">{current.temperature}°</div>
          )}
          <div className="andre-weather-now-label">{current.label}</div>
        </div>
      </div>

      <div className="andre-weather-scroll">
        <div className="andre-weather-track">
          {hourly.map((item) => (
            <div key={item.key} className="andre-weather-hour">
              <div className="andre-weather-hour-time">{item.timeLabel}</div>
              {item.symbol && (
                <img
                  className="andre-weather-hour-icon"
                  alt=""
                  src={getWeatherIconUrl(item.symbol)}
                />
              )}
              {item.temperature != null && (
                <div className="andre-weather-hour-temp">
                  {item.temperature}°
                </div>
              )}
            </div>
          ))}

          {days.map((day) => (
            <div key={day.dayOffset} className="andre-weather-day">
              <div className="andre-weather-day-label">{day.dayLabel}</div>
              <div className="andre-weather-day-points">
                {day.points.map((item) => (
                  <div key={item.key} className="andre-weather-day-item">
                    {item.symbol && (
                      <img
                        className="andre-weather-day-icon"
                        alt=""
                        src={getWeatherIconUrl(item.symbol)}
                      />
                    )}
                    {item.temperature != null && (
                      <div className="andre-weather-day-temp">
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
    </div>
  );
};
