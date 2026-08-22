import React, { useMemo, useState } from "react";
import classNames from "classnames";
import { useTemperatureInsights } from "../helpers/useTemperatureInsights";
import { useCapabilityInsights } from "../helpers/useCapabilityInsights";
import { useGetDevice } from "../../../components/Devices/helpers/useGetDevice";
import { useMakeCapabilityInstance } from "../../../components/Devices/helpers/useMakeCapabilityInstance";
import {
  AIR_QUALITY_STATUS_COLORS,
  getCo2ChartThresholds,
  getCo2Status,
} from "../helpers/airQualityMetrics";

const RANGES = [
  { id: "day", label: "Dag" },
  { id: "week", label: "Uke" },
  { id: "month", label: "Måned" },
];

const formatTemp = (value) => `${Math.round(value * 10) / 10}°`;
const formatCo2 = (value) => `${Math.round(value)}`;

const alignSeries = (primary = [], secondary = []) => {
  const length = Math.max(primary.length, secondary.length);
  if (length === 0) return { primary: [], secondary: [] };

  const padSeries = (series) => {
    if (!series.length) return Array(length).fill(null);
    if (series.length >= length) return series.slice(-length);
    const fill = series[0];
    return [...Array(length - series.length).fill(fill), ...series];
  };

  return {
    primary: padSeries(primary),
    secondary: padSeries(secondary),
  };
};

const getXLabels = (pointCount, range) => {
  if (pointCount < 2) return [];

  const now = new Date();
  const labels = [];

  if (range === "day") {
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

  const seen = new Set();
  return labels.filter((label) => {
    if (seen.has(label.index)) return false;
    seen.add(label.index);
    return true;
  });
};

const buildPath = (points, toX, toY) => {
  let d = "";
  points.forEach((value, index) => {
    if (typeof value !== "number" || Number.isNaN(value)) return;
    const segment = `${toX(index)},${toY(value)}`;
    d = d ? `${d} L ${segment}` : `M ${segment}`;
  });
  return d;
};

const buildCo2ColoredSegments = (
  points,
  pointCount,
  padLeft,
  plotWidth,
  toCo2Y
) => {
  const toXAt = (indexFloat) =>
    padLeft + (indexFloat / Math.max(pointCount - 1, 1)) * plotWidth;

  const splitSegment = (index, v0, v1) => {
    const thresholds = getCo2ChartThresholds();
    const cuts = [0, 1];
    for (const threshold of thresholds) {
      if (v0 === v1) continue;
      if (
        (v0 < threshold && v1 > threshold) ||
        (v0 > threshold && v1 < threshold)
      ) {
        const t = (threshold - v0) / (v1 - v0);
        if (t > 0 && t < 1) cuts.push(t);
      }
    }
    cuts.sort((a, b) => a - b);

    const segments = [];
    for (let i = 0; i < cuts.length - 1; i += 1) {
      const tStart = cuts[i];
      const tEnd = cuts[i + 1];
      const valStart = v0 + tStart * (v1 - v0);
      const valEnd = v0 + tEnd * (v1 - v0);
      const status = getCo2Status((valStart + valEnd) / 2);
      segments.push({
        key: `${index}-${tStart}-${tEnd}`,
        d: `M ${toXAt(index + tStart)},${toCo2Y(valStart)} L ${toXAt(index + tEnd)},${toCo2Y(valEnd)}`,
        color: AIR_QUALITY_STATUS_COLORS[status],
      });
    }
    return segments;
  };

  const segments = [];
  for (let index = 0; index < points.length - 1; index += 1) {
    const v0 = points[index];
    const v1 = points[index + 1];
    if (typeof v0 !== "number" || typeof v1 !== "number") continue;
    segments.push(...splitSegment(index, v0, v1));
  }
  return segments;
};

const ClimateChart = ({ tempPoints, co2Points, range, showTemp, showCo2 }) => {
  const chart = useMemo(() => {
    const visibleTemp = showTemp ? tempPoints : [];
    const visibleCo2 = showCo2 ? co2Points : [];

    if (!visibleTemp?.length && !visibleCo2?.length) return null;

    const { primary: alignedTemp, secondary: alignedCo2 } = alignSeries(
      visibleTemp,
      visibleCo2
    );
    const pointCount = Math.max(alignedTemp.length, alignedCo2.length);
    const validTemp = showTemp
      ? alignedTemp.filter((value) => typeof value === "number")
      : [];
    const validCo2 = showCo2
      ? alignedCo2.filter((value) => typeof value === "number")
      : [];
    if (!validTemp.length && !validCo2.length) return null;

    const width = 640;
    const height = 200;
    const padLeft = showTemp && validTemp.length ? 44 : 12;
    const padRight = showCo2 && validCo2.length ? 44 : 12;
    const padTop = 12;
    const padBottom = 28;
    const plotWidth = width - padLeft - padRight;
    const plotHeight = height - padTop - padBottom;

    const toX = (index) =>
      padLeft + (index / Math.max(pointCount - 1, 1)) * plotWidth;

    let tempDomain = null;
    if (validTemp.length) {
      const min = Math.min(...validTemp);
      const max = Math.max(...validTemp);
      const yMin = Math.floor(min - 0.2);
      const yMax = Math.ceil(max + 0.2);
      tempDomain = { yMin, yMax, ySpan: Math.max(yMax - yMin, 1) };
    }

    let co2Domain = null;
    if (validCo2.length) {
      const min = Math.min(...validCo2);
      const max = Math.max(...validCo2);
      const padding = Math.max(Math.round((max - min) * 0.1), 25);
      const yMin = Math.max(0, Math.floor(min - padding));
      const yMax = Math.ceil(max + padding);
      co2Domain = { yMin, yMax, ySpan: Math.max(yMax - yMin, 1) };
    }

    const toTempY = (value) =>
      padTop +
      plotHeight -
      ((value - tempDomain.yMin) / tempDomain.ySpan) * plotHeight;

    const toCo2Y = (value) =>
      padTop +
      plotHeight -
      ((value - co2Domain.yMin) / co2Domain.ySpan) * plotHeight;

    const leftTicks = tempDomain
      ? [
          tempDomain.yMax,
          (tempDomain.yMin + tempDomain.yMax) / 2,
          tempDomain.yMin,
        ]
      : [];
    const rightTicks = co2Domain
      ? [co2Domain.yMax, (co2Domain.yMin + co2Domain.yMax) / 2, co2Domain.yMin]
      : [];

    const xLabels = getXLabels(pointCount, range);

    return {
      width,
      height,
      padLeft,
      padRight,
      plotWidth,
      plotHeight,
      tempPath:
        showTemp && tempDomain ? buildPath(alignedTemp, toX, toTempY) : "",
      co2Segments:
        showCo2 && co2Domain
          ? buildCo2ColoredSegments(
              alignedCo2,
              pointCount,
              padLeft,
              plotWidth,
              toCo2Y
            )
          : [],
      leftTicks: showTemp
        ? leftTicks.map((value) => ({
            value,
            y: toTempY(value),
            text: formatTemp(value),
          }))
        : [],
      rightTicks: showCo2
        ? rightTicks.map((value) => ({
            value,
            y: toCo2Y(value),
            text: formatCo2(value),
          }))
        : [],
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
      hasCo2: showCo2 && Boolean(co2Domain),
      showTempAxis: showTemp && Boolean(tempDomain),
    };
  }, [tempPoints, co2Points, range, showTemp, showCo2]);

  if (!chart) {
    return <div className="andre-temp-chart andre-temp-chart--empty" />;
  }

  return (
    <svg
      className="andre-temp-chart"
      viewBox={`0 0 ${chart.width} ${chart.height}`}
      preserveAspectRatio="none"
      role="img"
      aria-label="Temperatur- og CO₂-graf"
    >
      {chart.leftTicks.map((tick) => (
        <g key={`left-${tick.text}`}>
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

      {!chart.leftTicks.length &&
        chart.rightTicks.map((tick) => (
          <line
            key={`grid-${tick.text}`}
            className="andre-temp-chart-grid"
            x1={chart.axis.x1}
            y1={tick.y}
            x2={chart.axis.x2}
            y2={tick.y}
          />
        ))}

      {chart.rightTicks.map((tick) => (
        <text
          key={`right-${tick.text}`}
          className="andre-temp-chart-label andre-temp-chart-label--right"
          x={chart.axis.x2 + 8}
          y={tick.y}
          textAnchor="start"
          dominantBaseline="middle"
        >
          {tick.text}
        </text>
      ))}

      {chart.showTempAxis && (
        <line
          className="andre-temp-chart-axis"
          x1={chart.axis.x1}
          y1={chart.axis.y1}
          x2={chart.axis.x1}
          y2={chart.axis.y2}
        />
      )}
      {chart.hasCo2 && (
        <line
          className="andre-temp-chart-axis andre-temp-chart-axis--right"
          x1={chart.axis.x2}
          y1={chart.axis.y1}
          x2={chart.axis.x2}
          y2={chart.axis.y2}
        />
      )}
      <line
        className="andre-temp-chart-axis"
        x1={chart.axis.x1}
        y1={chart.axis.y2}
        x2={chart.axis.x2}
        y2={chart.axis.y2}
      />

      {chart.tempPath && (
        <path d={chart.tempPath} className="andre-temp-chart-line" />
      )}
      {chart.co2Segments?.map((segment) => (
        <path
          key={segment.key}
          d={segment.d}
          className="andre-temp-chart-line--co2-segment"
          stroke={segment.color}
        />
      ))}

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

export const TemperatureSection = ({ deviceId, co2DeviceId }) => {
  const [range, setRange] = useState("day");
  const [showTempSeries, setShowTempSeries] = useState(true);
  const [showCo2Series, setShowCo2Series] = useState(true);
  const tempInsights = useTemperatureInsights(deviceId, range);
  const [co2Device, setCo2Device] = useGetDevice(co2DeviceId);
  const hasCo2 = co2Device?.capabilities?.includes("measure_co2");
  const co2Insights = useCapabilityInsights(
    hasCo2 ? co2DeviceId : null,
    "measure_co2",
    range
  );

  const [device, setDevice] = useGetDevice(deviceId);
  useMakeCapabilityInstance(device, setDevice, "measure_temperature");
  useMakeCapabilityInstance(
    hasCo2 ? co2Device : null,
    setCo2Device,
    "measure_co2"
  );

  const liveTemp = device?.capabilitiesObj?.measure_temperature?.value;
  const currentTemp =
    typeof liveTemp === "number"
      ? liveTemp
      : typeof tempInsights.current === "number"
        ? tempInsights.current
        : null;

  const liveCo2 = co2Device?.capabilitiesObj?.measure_co2?.value;
  const currentCo2 =
    typeof liveCo2 === "number"
      ? liveCo2
      : typeof co2Insights.current === "number"
        ? co2Insights.current
        : null;

  const hasTempChart = tempInsights.points?.length > 0;
  const hasCo2Chart = co2Insights.points?.length > 0;
  const hasVisibleChart =
    (showTempSeries && hasTempChart) ||
    (showCo2Series && hasCo2 && hasCo2Chart);
  const hasChart = hasTempChart || (hasCo2 && hasCo2Chart);
  const showLoading =
    (tempInsights.showLoading && !hasTempChart) ||
    (hasCo2 && co2Insights.showLoading && !hasCo2Chart);
  const showError =
    tempInsights.status === "error" &&
    co2Insights.status === "error" &&
    !hasChart;

  return (
    <section className="andre-section">
      <h2 className="andre-section-title">
        {hasCo2 ? "Temperatur & CO₂" : "Temperatur"}
      </h2>

      <div className="andre-temp-current-row">
        <div className="andre-temp-current">
          {typeof currentTemp === "number" ? `${currentTemp.toFixed(1)}°` : "–"}
        </div>
        {hasCo2 && (
          <div
            className={classNames(
              "andre-temp-current",
              "andre-temp-current--co2",
              currentCo2 != null &&
                `andre-temp-current--${getCo2Status(currentCo2)}`
            )}
          >
            {typeof currentCo2 === "number" ? (
              <>
                {Math.round(currentCo2)}
                <span className="andre-temp-current-unit">ppm CO₂</span>
              </>
            ) : (
              "–"
            )}
          </div>
        )}
      </div>

      {hasCo2 && hasChart && (
        <div className="andre-temp-legend" role="group" aria-label="Vis serier">
          <button
            type="button"
            className={classNames(
              "andre-temp-legend-item",
              "andre-temp-legend-item--temp",
              { "andre-temp-legend-item--off": !showTempSeries }
            )}
            aria-pressed={showTempSeries}
            onClick={() => setShowTempSeries((value) => !value)}
          >
            Temperatur
          </button>
          <button
            type="button"
            className={classNames(
              "andre-temp-legend-item",
              "andre-temp-legend-item--co2",
              { "andre-temp-legend-item--off": !showCo2Series }
            )}
            aria-pressed={showCo2Series}
            onClick={() => setShowCo2Series((value) => !value)}
          >
            CO₂
          </button>
        </div>
      )}

      <div className="andre-temp-chart-wrap">
        {hasVisibleChart && (
          <ClimateChart
            tempPoints={tempInsights.points}
            co2Points={hasCo2 ? co2Insights.points : []}
            range={range}
            showTemp={showTempSeries}
            showCo2={showCo2Series && hasCo2}
          />
        )}
        {hasChart && !hasVisibleChart && (
          <div className="andre-temp-status">Slå på minst én serie</div>
        )}
        {!hasChart && showLoading && (
          <div className="andre-temp-status">Henter historikk…</div>
        )}
        {!hasChart && !showLoading && tempInsights.status === "loading" && (
          <div className="andre-temp-chart andre-temp-chart--empty" />
        )}
        {tempInsights.showLoading && hasVisibleChart && (
          <div className="andre-temp-loading-overlay">Henter historikk…</div>
        )}
        {showError && (
          <div className="andre-temp-status andre-temp-status--error">
            Kunne ikke hente historikk
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
