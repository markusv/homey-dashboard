import React, { useMemo, useState } from "react";
import classNames from "classnames";
import { useTemperatureInsights } from "../helpers/useTemperatureInsights";
import { useGetDevice } from "../../../components/Devices/helpers/useGetDevice";
import { useMakeCapabilityInstance } from "../../../components/Devices/helpers/useMakeCapabilityInstance";

const RANGES = [
  { id: "day", label: "Dag" },
  { id: "week", label: "Uke" },
  { id: "month", label: "Måned" },
];

const formatTemp = (value) => `${Math.round(value * 10) / 10}°`;

const getXLabels = (pointCount, range) => {
  if (pointCount < 2) return [];

  const now = new Date();
  const labels = [];

  if (range === "day") {
    // Last 24 hourly buckets ending near "now"
    const ticks = [0, 0.25, 0.5, 0.75, 1];
    for (const t of ticks) {
      const index = Math.round(t * (pointCount - 1));
      const hoursAgo = Math.round((1 - t) * 24);
      const at = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
      labels.push({
        index,
        text: at.toLocaleTimeString("nb-NO", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    }
  } else if (range === "week") {
    const ticks = [0, 0.33, 0.66, 1];
    for (const t of ticks) {
      const index = Math.round(t * (pointCount - 1));
      const daysAgo = Math.round((1 - t) * 7);
      const at = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      labels.push({
        index,
        text: at.toLocaleDateString("nb-NO", {
          weekday: "short",
          day: "numeric",
        }),
      });
    }
  } else {
    const ticks = [0, 0.33, 0.66, 1];
    for (const t of ticks) {
      const index = Math.round(t * (pointCount - 1));
      const daysAgo = Math.round((1 - t) * 30);
      const at = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      labels.push({
        index,
        text: at.toLocaleDateString("nb-NO", {
          day: "numeric",
          month: "short",
        }),
      });
    }
  }

  // Deduplicate identical indices
  const seen = new Set();
  return labels.filter((label) => {
    if (seen.has(label.index)) return false;
    seen.add(label.index);
    return true;
  });
};

const TemperatureChart = ({ points, range }) => {
  const chart = useMemo(() => {
    if (!points?.length) return null;

    const width = 640;
    const height = 200;
    const padLeft = 44;
    const padRight = 12;
    const padTop = 12;
    const padBottom = 28;
    const plotWidth = width - padLeft - padRight;
    const plotHeight = height - padTop - padBottom;

    const min = Math.min(...points);
    const max = Math.max(...points);
    // Nice y-domain with a little headroom
    const yMin = Math.floor(min - 0.2);
    const yMax = Math.ceil(max + 0.2);
    const ySpan = Math.max(yMax - yMin, 1);

    const toX = (index) =>
      padLeft + (index / Math.max(points.length - 1, 1)) * plotWidth;
    const toY = (value) =>
      padTop + plotHeight - ((value - yMin) / ySpan) * plotHeight;

    const coords = points.map((value, index) => `${toX(index)},${toY(value)}`);
    const yTicks = [yMax, (yMin + yMax) / 2, yMin];
    const xLabels = getXLabels(points.length, range);

    return {
      width,
      height,
      padLeft,
      padTop,
      plotWidth,
      plotHeight,
      d: `M ${coords.join(" L ")}`,
      yTicks: yTicks.map((value) => ({
        value,
        y: toY(value),
        text: formatTemp(value),
      })),
      xLabels: xLabels.map((label) => ({
        ...label,
        x: toX(label.index),
      })),
      axis: {
        x1: padLeft,
        y1: padTop,
        x2: padLeft + plotWidth,
        y2: padTop + plotHeight,
      },
    };
  }, [points, range]);

  if (!chart) {
    return <div className="andre-temp-chart andre-temp-chart--empty" />;
  }

  return (
    <svg
      className="andre-temp-chart"
      viewBox={`0 0 ${chart.width} ${chart.height}`}
      preserveAspectRatio="none"
      role="img"
      aria-label="Temperaturgraf"
    >
      {/* Grid + axes */}
      {chart.yTicks.map((tick) => (
        <g key={`y-${tick.text}`}>
          <line
            className="andre-temp-chart-grid"
            x1={chart.axis.x1}
            y1={tick.y}
            x2={chart.axis.x2}
            y2={tick.y}
          />
          <text
            className="andre-temp-chart-label"
            x={chart.padLeft - 8}
            y={tick.y}
            textAnchor="end"
            dominantBaseline="middle"
          >
            {tick.text}
          </text>
        </g>
      ))}

      <line
        className="andre-temp-chart-axis"
        x1={chart.axis.x1}
        y1={chart.axis.y1}
        x2={chart.axis.x1}
        y2={chart.axis.y2}
      />
      <line
        className="andre-temp-chart-axis"
        x1={chart.axis.x1}
        y1={chart.axis.y2}
        x2={chart.axis.x2}
        y2={chart.axis.y2}
      />

      <path d={chart.d} className="andre-temp-chart-line" />

      {chart.xLabels.map((label) => (
        <text
          key={`x-${label.index}-${label.text}`}
          className="andre-temp-chart-label"
          x={label.x}
          y={chart.axis.y2 + 18}
          textAnchor="middle"
        >
          {label.text}
        </text>
      ))}
    </svg>
  );
};

export const TemperatureSection = ({ deviceId }) => {
  const [range, setRange] = useState("day");
  const insights = useTemperatureInsights(deviceId, range);
  const [device, setDevice] = useGetDevice(deviceId);
  useMakeCapabilityInstance(device, setDevice, "measure_temperature");

  const liveTemp = device?.capabilitiesObj?.measure_temperature?.value;
  const current =
    typeof liveTemp === "number"
      ? liveTemp
      : typeof insights.current === "number"
        ? insights.current
        : null;

  const hasChart = insights.points?.length > 0;

  return (
    <section className="andre-section">
      <h2 className="andre-section-title">Temperatur</h2>
      <div className="andre-temp-current">
        {typeof current === "number" ? `${current.toFixed(1)}°` : "–"}
      </div>

      <div className="andre-temp-chart-wrap">
        {hasChart && (
          <TemperatureChart points={insights.points} range={range} />
        )}
        {!hasChart && insights.showLoading && (
          <div className="andre-temp-status">Henter historikk…</div>
        )}
        {!hasChart &&
          !insights.showLoading &&
          insights.status === "loading" && (
            <div className="andre-temp-chart andre-temp-chart--empty" />
          )}
        {insights.showLoading && hasChart && (
          <div className="andre-temp-loading-overlay">Henter historikk…</div>
        )}
        {insights.status === "error" && !hasChart && (
          <div className="andre-temp-status andre-temp-status--error">
            Kunne ikke hente temperaturhistorikk
          </div>
        )}
      </div>

      <div className="andre-temp-ranges" role="tablist">
        {RANGES.map((entry) => (
          <button
            key={entry.id}
            type="button"
            role="tab"
            aria-selected={range === entry.id}
            className={classNames("andre-temp-range", {
              "andre-temp-range--active": range === entry.id,
            })}
            onClick={() => setRange(entry.id)}
          >
            {entry.label}
          </button>
        ))}
      </div>
    </section>
  );
};
