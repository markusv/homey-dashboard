import React, { useMemo } from "react";
import { useFetchForecast } from "../../../components/Weather/helpers/useFetchForecast";
import { getForecastItemsForDay } from "../../../components/Weather/helpers/getForecastItemsForDay";
import { getNameOfDay } from "../../../components/Weather/helpers/getNameOfDay";
import {
  getWeatherIconUrl,
  getWeatherPeriod,
  getWeatherSymbolLabel,
} from "../helpers/weatherLabels";

/** Hours shown for "today" in the hourly strip (from API timeseries). */
const HOURLY_TODAY_COUNT = 8;
/** Extra calendar days after today (tomorrow + following). */
const FUTURE_DAYS = 4;

const buildHourlyToday = (forecast) => {
  const now = Date.now() - 20 * 60 * 1000;
  const todayDate = new Date().getDate();
  return forecast
    .filter((entry) => new Date(entry.time).getTime() >= now)
    .filter((entry) => new Date(entry.time).getDate() === todayDate)
    .filter((entry) => getWeatherPeriod(entry))
    .slice(0, HOURLY_TODAY_COUNT)
    .map((entry, index) => {
      const period = getWeatherPeriod(entry);
      const temp = entry.data?.instant?.details?.air_temperature;
      const time = new Date(entry.time);
      return {
        key: entry.time,
        isNow: index === 0,
        timeLabel:
          index === 0
            ? "NÅ"
            : time.toLocaleTimeString("nb-NO", {
                hour: "2-digit",
                minute: "2-digit",
              }),
        symbol: period?.summary?.symbol_code,
        temperature: typeof temp === "number" ? Math.round(temp) : null,
      };
    });
};

const buildFutureDays = (forecast) => {
  const days = [];
  for (let offset = 1; offset <= FUTURE_DAYS; offset += 1) {
    const dateForForecast = new Date();
    dateForForecast.setDate(dateForForecast.getDate() + offset);
    const forecastForDay = forecast.filter(
      (entry) => new Date(entry.time).getDate() === dateForForecast.getDate()
    );
    if (!forecastForDay.length) continue;

    const points = getForecastItemsForDay(forecastForDay)
      .filter(Boolean)
      .filter((item) => getWeatherPeriod(item))
      .map((item) => {
        const period = getWeatherPeriod(item);
        const temp = item.data?.instant?.details?.air_temperature;
        return {
          key: item.time,
          symbol: period?.summary?.symbol_code,
          temperature: typeof temp === "number" ? Math.round(temp) : null,
        };
      });

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
    const hourlyPoints = buildHourlyToday(forecast);
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
      hourly: hourlyPoints,
      days: buildFutureDays(forecast),
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
      <div className="andre-weather-track">
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
              <div className="andre-weather-now-temp">
                {current.temperature}°
              </div>
            )}
            <div className="andre-weather-now-label">{current.label}</div>
          </div>
        </div>

        {hourly.map((item) => (
          <div
            key={item.key}
            className={`andre-weather-hour${item.isNow ? " andre-weather-hour--now" : ""}`}
          >
            <div className="andre-weather-hour-time">{item.timeLabel}</div>
            {item.symbol && (
              <img
                className="andre-weather-hour-icon"
                alt=""
                src={getWeatherIconUrl(item.symbol)}
              />
            )}
            {item.temperature != null && (
              <div className="andre-weather-hour-temp">{item.temperature}°</div>
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
  );
};
