import {
  RAIN_HEIGHTS_PER_SEC,
  SNOW_HEIGHTS_PER_SEC,
  WEATHER_OVERLAY_KIND,
} from "../WeatherOverlay.constants";
import { getOverlayCanvasScale } from "./getOverlayCanvasScale";
import { getPrecipMotionScale } from "./getPrecipMotionScale";

const RAIN_ANGLE = (12 * Math.PI) / 180;

const sizeCanvas = (canvas) => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const scale = getOverlayCanvasScale(
    width,
    height,
    window.devicePixelRatio || 1
  );
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const ctx = canvas.getContext("2d", {
    alpha: true,
    desynchronized: true,
  });
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.imageSmoothingEnabled = false;
  return { ctx, width, height };
};

const createRaindrops = (count, width, height, intensity = 1) =>
  Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    len: Math.max(
      14,
      height * (0.032 + Math.random() * 0.04 + intensity * 0.015)
    ),
    speed:
      RAIN_HEIGHTS_PER_SEC.min +
      Math.random() * RAIN_HEIGHTS_PER_SEC.span +
      intensity * RAIN_HEIGHTS_PER_SEC.intensity,
    width: 1.35 + Math.random() * 0.7 + intensity * 0.25,
    alpha: 0.32 + Math.random() * 0.32,
  }));

const createSnowflakes = (count, width, height, intensity = 1) =>
  Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: 1.6 + Math.random() * 3.2 + intensity * 1.4,
    speed:
      SNOW_HEIGHTS_PER_SEC.min +
      Math.random() * SNOW_HEIGHTS_PER_SEC.span +
      intensity * SNOW_HEIGHTS_PER_SEC.intensity,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.48 + Math.random() * 0.72,
    alpha: 0.38 + Math.random() * 0.34 + intensity * 0.1,
  }));

const drawRaindrops = (ctx, drops, width, height, motion) => {
  const dx = Math.sin(RAIN_ANGLE);
  const dy = Math.cos(RAIN_ANGLE);
  ctx.lineCap = "round";
  ctx.strokeStyle = "rgba(220, 236, 252, 0.48)";
  ctx.lineWidth = 1.7;
  ctx.beginPath();
  drops.forEach((drop) => {
    const step = drop.speed * height * motion;
    drop.y += step * dy;
    drop.x += step * dx;
    if (drop.y > height + 20 || drop.x > width + 20) {
      drop.y = -20;
      drop.x = Math.random() * width;
    }
    ctx.moveTo(drop.x, drop.y);
    ctx.lineTo(drop.x + dx * drop.len, drop.y + dy * drop.len);
  });
  ctx.stroke();
};

const drawSnowflakes = (ctx, flakes, width, height, motion, dtSeconds) => {
  ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
  ctx.beginPath();
  flakes.forEach((flake) => {
    flake.wobble += flake.wobbleSpeed * dtSeconds;
    flake.y += flake.speed * height * motion;
    flake.x += Math.sin(flake.wobble) * height * 0.03 * dtSeconds;
    if (flake.y > height + 8) {
      flake.y = -8;
      flake.x = Math.random() * width;
    }
    ctx.moveTo(flake.x + flake.r, flake.y);
    ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
  });
  ctx.fill();
};

export const createPrecipParticles = ({
  kind,
  count,
  width,
  height,
  intensity = 1,
}) => {
  if (kind === WEATHER_OVERLAY_KIND.SNOW) {
    return {
      rain: [],
      snow: createSnowflakes(count, width, height, intensity),
    };
  }
  if (kind === WEATHER_OVERLAY_KIND.SLEET) {
    const rainCount = Math.round(count * 0.6);
    const snowCount = Math.max(0, count - rainCount);
    return {
      rain: createRaindrops(rainCount, width, height, intensity),
      snow: createSnowflakes(snowCount, width, height, intensity),
    };
  }
  if (kind === WEATHER_OVERLAY_KIND.RAIN) {
    return {
      rain: createRaindrops(count, width, height, intensity),
      snow: [],
    };
  }
  return { rain: [], snow: [] };
};

export const drawPrecipFrame = ({
  ctx,
  particles,
  width,
  height,
  intensity: _intensity,
  animate,
  dtSeconds = 0,
}) => {
  ctx.clearRect(0, 0, width, height);
  const motion = getPrecipMotionScale({
    animate,
    dtSeconds,
  });
  if (particles.rain.length) {
    drawRaindrops(ctx, particles.rain, width, height, motion);
  }
  if (particles.snow.length) {
    drawSnowflakes(
      ctx,
      particles.snow,
      width,
      height,
      motion,
      animate ? dtSeconds : 0
    );
  }
};

export { sizeCanvas };
