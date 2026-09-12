import { WEATHER_OVERLAY_KIND } from "../WeatherOverlay.constants";

const RAIN_ANGLE = (12 * Math.PI) / 180;

const sizeCanvas = (canvas) => {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width, height };
};

const createRaindrops = (count, width, height, intensity = 1) =>
  Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    len: 16 + Math.random() * 22 + intensity * 10,
    speed: 4.6 + Math.random() * 3.6 + intensity * 2.2,
    width: 1.35 + Math.random() * 0.7 + intensity * 0.25,
    alpha: 0.32 + Math.random() * 0.32,
  }));

const createSnowflakes = (count, width, height, intensity = 1) =>
  Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: 1.6 + Math.random() * 3.2 + intensity * 1.4,
    speed: 0.4 + Math.random() * 0.65 + intensity * 0.25,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.008 + Math.random() * 0.012,
    alpha: 0.38 + Math.random() * 0.34 + intensity * 0.1,
  }));

export const drawSunGlow = (ctx, width, height, intensity) => {
  ctx.clearRect(0, 0, width, height);
  if (intensity <= 0) {
    return;
  }
  const gx = width * 0.82;
  const gy = height * 0.08;
  const radius = Math.max(width, height) * (0.55 + intensity * 0.18);
  const glow = ctx.createRadialGradient(gx, gy, 8, gx, gy, radius);
  glow.addColorStop(0, `rgba(255, 214, 140, ${0.26 * intensity})`);
  glow.addColorStop(0.35, `rgba(255, 196, 110, ${0.12 * intensity})`);
  glow.addColorStop(1, "rgba(255, 180, 80, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  const moteCount = Math.round(8 + intensity * 14);
  for (let i = 0; i < moteCount; i += 1) {
    const x = width * 0.45 + Math.random() * width * 0.55;
    const y = Math.random() * height * 0.55;
    const r = 0.8 + Math.random() * 1.8;
    ctx.fillStyle = `rgba(255, 236, 190, ${0.1 + Math.random() * 0.2 * intensity})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
};

const drawRaindrops = (ctx, drops, width, height, speedScale) => {
  const dx = Math.sin(RAIN_ANGLE);
  const dy = Math.cos(RAIN_ANGLE);
  ctx.lineCap = "round";
  drops.forEach((drop) => {
    drop.y += drop.speed * speedScale * dy;
    drop.x += drop.speed * speedScale * dx;
    if (drop.y > height + 20 || drop.x > width + 20) {
      drop.y = -20;
      drop.x = Math.random() * width;
    }
    ctx.strokeStyle = `rgba(220, 236, 252, ${drop.alpha})`;
    ctx.lineWidth = drop.width;
    ctx.beginPath();
    ctx.moveTo(drop.x, drop.y);
    ctx.lineTo(drop.x + dx * drop.len, drop.y + dy * drop.len);
    ctx.stroke();
  });
};

const drawSnowflakes = (ctx, flakes, width, height, speedScale) => {
  flakes.forEach((flake) => {
    flake.wobble += flake.wobbleSpeed;
    flake.y += flake.speed * speedScale;
    flake.x += Math.sin(flake.wobble) * 0.45;
    if (flake.y > height + 8) {
      flake.y = -8;
      flake.x = Math.random() * width;
    }
    const gradient = ctx.createRadialGradient(
      flake.x,
      flake.y,
      0,
      flake.x,
      flake.y,
      flake.r * 2.2
    );
    gradient.addColorStop(0, `rgba(255,255,255,${flake.alpha})`);
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(flake.x, flake.y, flake.r * 2.2, 0, Math.PI * 2);
    ctx.fill();
  });
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
  intensity,
  animate,
}) => {
  ctx.clearRect(0, 0, width, height);
  const speedScale = animate ? 0.7 + intensity * 0.65 : 0;
  if (particles.rain.length) {
    drawRaindrops(ctx, particles.rain, width, height, speedScale);
  }
  if (particles.snow.length) {
    drawSnowflakes(ctx, particles.snow, width, height, speedScale);
  }
};

export { sizeCanvas };
