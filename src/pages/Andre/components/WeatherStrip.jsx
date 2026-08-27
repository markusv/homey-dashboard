import React, { useMemo } from "react";
import { useFetchForecast } from "../../../components/Weather/helpers/useFetchForecast";
import {
  getWeatherIconUrl,
  getWeatherPeriod,
  getWeatherSymbolLabel,
} from "../helpers/weatherLabels";

/** Compact hourly slots shown in the overview weather card. */
const HOURLY_SLOT_COUNT = 3;

const buildCompactForecast = (forecast) => {
  const now = Date.now() - 20 * 60 * 1000;
  const todayDate = new Date().getDate();
  const hourly = forecast
    .filter((entry) => new Date(entry.time).getTime() >= now)
    .filter((entry) => new Date(entry.time).getDate() === todayDate)
    .filter((entry) => getWeatherPeriod(entry))
    .slice(0, HOURLY_SLOT_COUNT + 1)
    .map((entry, index) => {
      const period = getWeatherPeriod(entry);
      const temp = entry.data?.instant?.details?.air_temperature;
      const time = new Date(entry.time);
      let timeLabel = time.toLocaleTimeString("nb-NO", {
        hour: "2-digit",
        minute: "2-digit",
      });
      if (index === 0) timeLabel = "NÅ";

      return {
        key: entry.time,
        isNow: index === 0,
        timeLabel,
        symbol: period?.summary?.symbol_code,
        temperature: typeof temp === "number" ? Math.round(temp) : null,
      };
    });

  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowEntries = forecast.filter(
    (entry) => new Date(entry.time).getDate() === tomorrowDate.getDate()
  );
  const tomorrowFirst = tomorrowEntries.find((entry) =>
    getWeatherPeriod(entry)
  );
  const tomorrowPeriod = tomorrowFirst ? getWeatherPeriod(tomorrowFirst) : null;
  const tomorrowTemp = tomorrowFirst?.data?.instant?.details?.air_temperature;

  const tomorrow =
    tomorrowFirst && tomorrowPeriod
      ? {
          key: `tomorrow-${tomorrowFirst.time}`,
          timeLabel: "I morgen",
          symbol: tomorrowPeriod.summary?.symbol_code,
          temperature:
            typeof tomorrowTemp === "number" ? Math.round(tomorrowTemp) : null,
        }
      : null;

  return { hourly, tomorrow };
};

export const WeatherStrip = () => {
  const [forecast] = useFetchForecast();

  const { current, hourly, tomorrow } = useMemo(() => {
    if (!forecast?.length) {
      return { current: null, hourly: [], tomorrow: null };
    }

    const { hourly: hourlyPoints, tomorrow: tomorrowPoint } =
      buildCompactForecast(forecast);
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
      tomorrow: tomorrowPoint,
    };
  }, [forecast]);

  if (!current) {
    return (
      <div className="andre-weather andre-weather--empty andre-glass">
        Laster vær…
      </div>
    );
  }

  const slots = [
    {
      key: "now",
      timeLabel: "NÅ",
      symbol: current.symbol,
      temperature: current.temperature,
      isNow: true,
    },
    ...hourly,
    ...(tomorrow ? [tomorrow] : []),
  ];

  return (
    <div
      className="andre-weather andre-glass"
      role="region"
      aria-label="Værmelding"
    >
      <div className="andre-weather-compact">
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

        <div className="andre-weather-slots">
          {slots.map((item) => (
            <div
              key={item.key}
              className={`andre-weather-slot${item.isNow ? " andre-weather-slot--now" : ""}`}
            >
              <div className="andre-weather-slot-time">{item.timeLabel}</div>
              {item.symbol && (
                <img
                  className="andre-weather-slot-icon"
                  alt=""
                  src={getWeatherIconUrl(item.symbol)}
                />
              )}
              {item.temperature != null && (
                <div className="andre-weather-slot-temp">
                  {item.temperature}°
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
