import { useMemo } from "react";
import classNames from "classnames";
import { useFetchForecast } from "../helpers/useFetchForecast";
import { WEATHER_OVERLAY_KIND } from "./WeatherOverlay.constants";
import { getPrecipDrops } from "./helpers/getPrecipDrops";
import { getWeatherOverlayPreview } from "./helpers/getWeatherOverlayPreview";
import { getWeatherOverlayState } from "./helpers/getWeatherOverlayState";
import { useIdleOverlayFade } from "./hooks/useIdleOverlayFade";
import "./WeatherOverlay.css";

export const WeatherOverlay = ({ dimmed: dimmedFromParent = false }) => {
  const [forecast] = useFetchForecast();
  const preview = useMemo(
    () => getWeatherOverlayPreview(window.location.search),
    []
  );
  const state = useMemo(
    () => preview ?? getWeatherOverlayState(forecast),
    [forecast, preview]
  );
  const idleDimmed = useIdleOverlayFade();
  const dimmed = dimmedFromParent || idleDimmed;
  const showPrecip =
    state.kind !== WEATHER_OVERLAY_KIND.NONE && state.intensity > 0;
  const drops = useMemo(
    () => (showPrecip ? getPrecipDrops(state.kind, state.intensity) : []),
    [showPrecip, state.intensity, state.kind]
  );

  if (!state.showSun && !showPrecip) {
    return null;
  }

  return (
    <div
      className={classNames("weather-overlay", {
        "weather-overlay--dimmed": dimmed,
      })}
      style={
        state.showSun
          ? { "--sun-intensity": String(state.sunIntensity) }
          : undefined
      }
      aria-hidden="true"
    >
      {state.showSun ? <div className="weather-overlay__sun" /> : null}
      {drops.map((drop) => (
        <span
          key={drop.id}
          className={
            drop.isRain ? "weather-overlay__drop" : "weather-overlay__flake"
          }
          style={{
            left: `${drop.leftPct}%`,
            opacity: drop.opacity,
            animationDuration: `${drop.durationSec}s`,
            animationDelay: `${drop.delaySec}s`,
            ...(drop.isRain
              ? { height: `${drop.lengthPx}px` }
              : {
                  width: `${drop.sizePx}px`,
                  height: `${drop.sizePx}px`,
                }),
          }}
        />
      ))}
    </div>
  );
};
