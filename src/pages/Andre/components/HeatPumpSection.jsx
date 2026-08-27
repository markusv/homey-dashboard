import React from "react";
import classNames from "classnames";
import {
  useDebouncedTarget,
  useLiveHeatPump,
} from "../helpers/useLiveHeatPump";

const MODE_META = {
  heating: { label: "Varme", accent: "heat" },
  cooling: { label: "Kjøling", accent: "cool" },
};

export const HeatPumpSection = ({ deviceId }) => {
  const heatPump = useLiveHeatPump(deviceId);
  const {
    available,
    on,
    mode,
    target,
    indoor,
    fanSpeed,
    fanSpeedOptions,
    powerful,
    availableModes,
    targetMin,
    targetMax,
    targetStep,
    pending,
    togglePower,
    setMode,
    setTargetTemperature,
    setFanSpeed,
    togglePowerful,
  } = heatPump;

  const [localTarget, setLocalTarget, endTargetDrag] = useDebouncedTarget(
    target,
    setTargetTemperature
  );

  if (!available) return null;

  const accent =
    mode === "heating" ? "heat" : mode === "cooling" ? "cool" : null;
  const sliderPercent =
    typeof localTarget === "number"
      ? ((localTarget - targetMin) / (targetMax - targetMin)) * 100
      : 0;
  const fill =
    accent === "heat"
      ? "#f87171"
      : accent === "cool"
        ? "#60a5fa"
        : "var(--sl-color-primary-600)";

  const sliderStyle = {
    background: `linear-gradient(to right, ${fill} 0%, ${fill} ${sliderPercent}%, var(--sl-color-neutral-300) ${sliderPercent}%, var(--sl-color-neutral-300) 100%)`,
    "--andre-dim-fill": fill,
  };

  return (
    <section
      className={classNames("andre-section", "andre-heatpump", {
        "andre-heatpump--on": on,
        "andre-heatpump--heat": accent === "heat",
        "andre-heatpump--cool": accent === "cool",
        "andre-heatpump--pending": pending,
      })}
    >
      <h2 className="andre-section-title">Varmepumpe</h2>

      <div className="andre-heatpump-top">
        <button
          type="button"
          className={classNames("andre-heatpump-power", {
            "andre-heatpump-power--on": on,
          })}
          aria-pressed={on}
          aria-label={on ? "Slå av varmepumpe" : "Slå på varmepumpe"}
          disabled={pending}
          onClick={togglePower}
        >
          <sl-icon name="power" />
          <span>{on ? "På" : "Av"}</span>
        </button>

        <div className="andre-heatpump-temps">
          <div className="andre-heatpump-temp-main">
            {typeof localTarget === "number"
              ? `${localTarget.toFixed(1)}°`
              : "–"}
          </div>
          <div className="andre-heatpump-temp-sub">
            {typeof indoor === "number"
              ? `Inne ${indoor.toFixed(1)}°`
              : "Inne –"}
          </div>
        </div>
      </div>

      {availableModes.length > 0 && (
        <div className="andre-heatpump-modes" role="group" aria-label="Modus">
          {availableModes.map((modeId) => {
            const meta = MODE_META[modeId];
            if (!meta) return null;
            return (
              <button
                key={modeId}
                type="button"
                className={classNames(
                  "andre-heatpump-mode",
                  `andre-heatpump-mode--${meta.accent}`,
                  { "andre-heatpump-mode--active": mode === modeId }
                )}
                aria-pressed={mode === modeId}
                disabled={pending}
                onClick={() => setMode(modeId)}
              >
                {meta.label}
              </button>
            );
          })}
        </div>
      )}

      {typeof localTarget === "number" && (
        <div className="andre-heatpump-slider-wrap">
          <div className="andre-heatpump-slider-labels">
            <span>{targetMin}°</span>
            <span>Setpunkt</span>
            <span>{targetMax}°</span>
          </div>
          <input
            type="range"
            min={targetMin}
            max={targetMax}
            step={targetStep}
            value={localTarget}
            className="andre-dimmer-slider andre-heatpump-slider"
            style={sliderStyle}
            aria-label="Setpunkt temperatur"
            disabled={pending}
            onChange={(event) => {
              event.stopPropagation();
              setLocalTarget(Number(event.target.value));
            }}
            onPointerDown={(event) => event.stopPropagation()}
            onPointerUp={endTargetDrag}
            onTouchEnd={endTargetDrag}
            onMouseUp={endTargetDrag}
          />
        </div>
      )}

      <div
        className="andre-heatpump-speed"
        role="group"
        aria-label="Viftehastighet"
      >
        <div className="andre-heatpump-row-label">Vifte</div>
        <div className="andre-heatpump-speed-buttons">
          {fanSpeedOptions.map((speed) => (
            <button
              key={speed}
              type="button"
              className={classNames("andre-heatpump-chip", {
                "andre-heatpump-chip--active":
                  String(fanSpeed) === String(speed),
              })}
              aria-pressed={String(fanSpeed) === String(speed)}
              disabled={pending}
              onClick={() => setFanSpeed(speed)}
            >
              {speed}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        className={classNames("andre-heatpump-powerful", {
          "andre-heatpump-powerful--on": powerful,
        })}
        aria-pressed={powerful}
        disabled={pending}
        onClick={togglePowerful}
      >
        <sl-icon name="lightning-charge" />
        <span>{powerful ? "Powerful på" : "Powerful av"}</span>
      </button>
    </section>
  );
};
