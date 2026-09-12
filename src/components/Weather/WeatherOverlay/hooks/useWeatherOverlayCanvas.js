import { useEffect, useRef } from "react";
import {
  createPrecipParticles,
  drawPrecipFrame,
  sizeCanvas,
} from "../helpers/drawWeatherOverlay";
import { getOverlayParticleCount } from "../helpers/getOverlayParticleCount";
import {
  MAX_DT_SECONDS,
  OVERLAY_FRAME_MS,
  WEATHER_OVERLAY_KIND,
} from "../WeatherOverlay.constants";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const useWeatherOverlayCanvas = ({
  precipCanvasRef,
  state,
  paused = false,
}) => {
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const stopRef = useRef(() => {});
  const resumeRef = useRef(() => {});

  useEffect(() => {
    const precipCanvas = precipCanvasRef.current;
    if (!precipCanvas) {
      return undefined;
    }

    let frameId;
    let timerId;
    let particles = { rain: [], snow: [] };
    let width = 0;
    let height = 0;
    let lastTs = 0;
    const animate = !prefersReducedMotion();

    const setupPrecip = () => {
      const sized = sizeCanvas(precipCanvas);
      width = sized.width;
      height = sized.height;
      const count = getOverlayParticleCount(
        state.kind,
        state.intensity,
        width,
        height
      );
      particles = createPrecipParticles({
        kind: state.kind,
        count,
        width,
        height,
        intensity: state.intensity,
      });
      return sized.ctx;
    };

    const precipCtx = setupPrecip();

    const stop = () => {
      window.clearTimeout(timerId);
      window.cancelAnimationFrame(frameId);
    };

    const tick = (ts) => {
      if (document.hidden || !precipCtx || pausedRef.current) {
        return;
      }
      const dtSeconds = lastTs
        ? Math.min((ts - lastTs) / 1000, MAX_DT_SECONDS)
        : OVERLAY_FRAME_MS / 1000;
      lastTs = ts;
      drawPrecipFrame({
        ctx: precipCtx,
        particles,
        width,
        height,
        intensity: state.intensity,
        animate,
        dtSeconds,
      });
      if (animate && state.kind !== WEATHER_OVERLAY_KIND.NONE) {
        timerId = window.setTimeout(() => {
          frameId = window.requestAnimationFrame(tick);
        }, OVERLAY_FRAME_MS);
      }
    };

    const resume = () => {
      if (
        document.hidden ||
        pausedRef.current ||
        !animate ||
        state.kind === WEATHER_OVERLAY_KIND.NONE
      ) {
        return;
      }
      stop();
      lastTs = 0;
      frameId = window.requestAnimationFrame(tick);
    };

    stopRef.current = stop;
    resumeRef.current = resume;
    resume();

    const onResize = () => {
      setupPrecip();
    };
    const onVisibility = () => {
      if (!document.hidden) {
        resume();
      } else {
        stop();
      }
    };

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [precipCanvasRef, state.intensity, state.kind]);

  useEffect(() => {
    if (paused) {
      stopRef.current();
      return undefined;
    }
    resumeRef.current();
    return undefined;
  }, [paused]);
};
