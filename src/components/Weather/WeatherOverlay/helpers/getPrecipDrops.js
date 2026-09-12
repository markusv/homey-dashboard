import { WEATHER_OVERLAY_KIND } from "../WeatherOverlay.constants";

const mulberry32 = (seed) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

const seedFromKindAndIntensity = (kind, intensity) => {
  const kindSeed =
    kind === WEATHER_OVERLAY_KIND.SNOW
      ? 2
      : kind === WEATHER_OVERLAY_KIND.SLEET
        ? 3
        : 1;
  return Math.round(kindSeed * 1000 + intensity * 997);
};

export const getPrecipDropCount = (kind, intensity) => {
  if (!kind || kind === WEATHER_OVERLAY_KIND.NONE || intensity <= 0) {
    return 0;
  }
  const eased = intensity ** 2.15;
  if (kind === WEATHER_OVERLAY_KIND.SNOW) {
    return Math.round(22 + 48 * eased);
  }
  if (kind === WEATHER_OVERLAY_KIND.SLEET) {
    return Math.round(28 + 52 * eased);
  }
  return Math.round(28 + 56 * eased);
};

export const getPrecipDrops = (kind, intensity) => {
  const count = getPrecipDropCount(kind, intensity);
  if (!count) {
    return [];
  }
  const random = mulberry32(seedFromKindAndIntensity(kind, intensity));
  const rainShare =
    kind === WEATHER_OVERLAY_KIND.SNOW
      ? 0
      : kind === WEATHER_OVERLAY_KIND.SLEET
        ? 0.6
        : 1;

  return Array.from({ length: count }, (_, index) => {
    const isRain = index < Math.round(count * rainShare);
    const duration = isRain
      ? 1.7 + random() * 1.1 - intensity * 0.35
      : 5.2 + random() * 3.4 - intensity * 1.1;
    return {
      id: index,
      isRain,
      leftPct: random() * 100,
      durationSec: Math.max(isRain ? 1.2 : 3.8, duration),
      delaySec: -(random() * Math.max(1.2, duration)),
      lengthPx: isRain ? 10 + random() * 16 + intensity * 8 : 0,
      sizePx: isRain ? 0 : 2 + random() * 3.2 + intensity * 1.2,
      opacity: 0.28 + random() * 0.38 + intensity * 0.08,
    };
  });
};
