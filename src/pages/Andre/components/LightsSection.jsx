import React from "react";
import { IconButton } from "./IconButton";
import { useDebouncedDim } from "../helpers/useLiveRoomLights";

const PRESET_COLORS = [
  "#e53935", // rød
  "#fdd835", // gul
  "#fb8c00", // oransje
  "#43a047", // grønn
  "#1e88e5", // blå
];

export const LightsSection = ({ lightState }) => {
  const {
    lights,
    on,
    dim,
    color,
    supportsDim,
    supportsColor,
    pending,
    toggleLights,
    setDim,
    setColor,
  } = lightState;

  const [localDim, setLocalDim, endDimDrag] = useDebouncedDim(dim, setDim);

  if (!lights.length) return null;

  const fill = color || "var(--sl-color-primary-600)";
  const percent = Math.round(localDim * 100);

  const activeStyle =
    on && color
      ? {
          color,
        }
      : undefined;

  const sliderStyle = {
    background: `linear-gradient(to right, ${fill} 0%, ${fill} ${percent}%, var(--sl-color-neutral-300) ${percent}%, var(--sl-color-neutral-300) 100%)`,
    ...(color ? { "--andre-dim-fill": color } : {}),
  };

  return (
    <section className="andre-section">
      <h2 className="andre-section-title">Lys</h2>
      <div className="andre-lights-onoff">
        <IconButton
          icon="lightbulb"
          label={on ? "Slå av lys" : "Slå på lys"}
          active={on}
          pending={pending}
          onClick={toggleLights}
          style={activeStyle}
          className={
            on
              ? "andre-icon-button--lit andre-icon-button--xl"
              : "andre-icon-button--xl"
          }
        />
        <span className="andre-lights-label">{on ? "På" : "Av"}</span>
      </div>

      {supportsDim && (
        <div className="andre-dimmer">
          <input
            type="range"
            min="0"
            max="100"
            value={percent}
            className="andre-dimmer-slider"
            style={sliderStyle}
            aria-label="Dimmer"
            onChange={(event) => {
              event.stopPropagation();
              setLocalDim(Number(event.target.value) / 100);
            }}
            onPointerDown={(event) => event.stopPropagation()}
            onPointerUp={endDimDrag}
            onTouchEnd={endDimDrag}
            onMouseUp={endDimDrag}
          />
        </div>
      )}

      {supportsColor && (
        <div className="andre-color-picker">
          {PRESET_COLORS.map((hex) => (
            <button
              key={hex}
              type="button"
              className="andre-color-swatch"
              aria-label={`Farge ${hex}`}
              style={{ backgroundColor: hex }}
              onClick={(event) => {
                event.stopPropagation();
                setColor(hex);
              }}
            />
          ))}
          <label className="andre-color-custom">
            <span>Egen</span>
            <input
              type="color"
              value="#ffffff"
              aria-label="Velg farge"
              onChange={(event) => setColor(event.target.value)}
              onPointerDown={(event) => event.stopPropagation()}
            />
          </label>
        </div>
      )}
    </section>
  );
};
