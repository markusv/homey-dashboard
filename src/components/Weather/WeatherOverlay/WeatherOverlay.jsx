import { useMemo, useRef } from "react";
import classNames from "classnames";
import { useFetchForecast } from "../helpers/useFetchForecast";
import { WEATHER_OVERLAY_KIND } from "./WeatherOverlay.constants";
import { getWeatherOverlayPreview } from "./helpers/getWeatherOverlayPreview";
import { getWeatherOverlayState } from "./helpers/getWeatherOverlayState";
import { useIdleOverlayFade } from "./hooks/useIdleOverlayFade";
import { useWeatherOverlayCanvas } from "./hooks/useWeatherOverlayCanvas";
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
  const sunCanvasRef = useRef(null);
  const precipCanvasRef = useRef(null);
  const showPrecip =
    state.kind !== WEATHER_OVERLAY_KIND.NONE && state.intensity > 0;

  useWeatherOverlayCanvas({
    sunCanvasRef,
    precipCanvasRef,
    state,
  });

  if (!state.showSun && !showPrecip) {
    return null;
  }

  return (
    <div
      className={classNames("weather-overlay", {
        "weather-overlay--dimmed": dimmed,
      })}
      aria-hidden="true"
    >
      <canvas ref={sunCanvasRef} className="weather-overlay__sun" />
      <canvas ref={precipCanvasRef} className="weather-overlay__precip" />
    </div>
  );
};
