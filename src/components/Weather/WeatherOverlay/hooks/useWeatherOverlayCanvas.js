import { useEffect } from "react";
import { WEATHER_OVERLAY_KIND } from "../WeatherOverlay.constants";
import {
  createPrecipParticles,
  drawPrecipFrame,
  drawSunGlow,
  sizeCanvas,
} from "../helpers/drawWeatherOverlay";
import { getOverlayParticleCount } from "../helpers/getOverlayParticleCount";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const useWeatherOverlayCanvas = ({
  sunCanvasRef,
  precipCanvasRef,
  state,
}) => {
  useEffect(() => {
    const sunCanvas = sunCanvasRef.current;
    const precipCanvas = precipCanvasRef.current;
    if (!sunCanvas && !precipCanvas) {
      return undefined;
    }

    let frameId;
    let particles = { rain: [], snow: [] };
    let width = 0;
    let height = 0;
    const animate = !prefersReducedMotion();

    const paintSun = () => {
      if (!sunCanvas) return;
      const sized = sizeCanvas(sunCanvas);
      drawSunGlow(sized.ctx, sized.width, sized.height, state.sunIntensity);
    };

    const setupPrecip = () => {
      if (!precipCanvas) return null;
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

    paintSun();
    const precipCtx = setupPrecip();

    const tick = () => {
      if (document.hidden || !precipCtx) {
        return;
      }
      drawPrecipFrame({
        ctx: precipCtx,
        particles,
        width,
        height,
        intensity: state.intensity,
        animate,
      });
      if (animate && state.kind !== WEATHER_OVERLAY_KIND.NONE) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    if (precipCtx) {
      tick();
    }

    const onResize = () => {
      paintSun();
      setupPrecip();
    };
    const onVisibility = () => {
      if (!document.hidden && animate && precipCtx) {
        window.cancelAnimationFrame(frameId);
        frameId = window.requestAnimationFrame(tick);
      }
    };

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [
    precipCanvasRef,
    state.intensity,
    state.kind,
    state.sunIntensity,
    sunCanvasRef,
  ]);
};
