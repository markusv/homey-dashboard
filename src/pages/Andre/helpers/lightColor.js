/** Homey light_hue / light_saturation are 0–1. */
export const homeyToCssColor = (hue, saturation, lightness = 50) => {
  if (typeof hue !== "number") return null;
  const h = Math.round((((hue % 1) + 1) % 1) * 360);
  const s =
    typeof saturation === "number"
      ? Math.round(Math.min(1, Math.max(0, saturation)) * 100)
      : 100;
  return `hsl(${h} ${s}% ${lightness}%)`;
};

export const cssHexToHomey = (hex) => {
  const normalized = String(hex || "")
    .replace("#", "")
    .trim();
  if (normalized.length !== 6) return null;

  const r = parseInt(normalized.slice(0, 2), 16) / 255;
  const g = parseInt(normalized.slice(2, 4), 16) / 255;
  const b = parseInt(normalized.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let hue = 0;
  if (delta !== 0) {
    if (max === r) hue = ((g - b) / delta) % 6;
    else if (max === g) hue = (b - r) / delta + 2;
    else hue = (r - g) / delta + 4;
    hue /= 6;
    if (hue < 0) hue += 1;
  }

  const lightness = (max + min) / 2;
  const saturation =
    delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

  return {
    light_hue: hue,
    light_saturation: Math.min(1, Math.max(0, saturation)),
  };
};

export const getLightGroupColor = (lights) => {
  const colorLight = lights.find(
    (light) =>
      light?.capabilities?.includes("light_hue") &&
      typeof light?.capabilitiesObj?.light_hue?.value === "number"
  );
  if (!colorLight) return null;

  return homeyToCssColor(
    colorLight.capabilitiesObj.light_hue.value,
    colorLight.capabilitiesObj.light_saturation?.value
  );
};
