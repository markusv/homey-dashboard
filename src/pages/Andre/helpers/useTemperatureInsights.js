import { useEffect, useRef, useState } from "react";

const RANGE_TO_RESOLUTION = {
  day: "last24Hours",
  week: "last7Days",
  month: "last31Days",
};

const LOADING_DELAY_MS = 500;

/**
 * Fetch Homey Insights temperature for a device.
 * Keeps previous points while refetching to avoid flicker.
 * Loading UI is deferred until LOADING_DELAY_MS.
 */
export const useTemperatureInsights = (deviceId, range = "day") => {
  const [state, setState] = useState({
    status: "idle",
    current: null,
    points: [],
    error: null,
    showLoading: false,
  });
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!deviceId) return undefined;

    const requestId = ++requestIdRef.current;
    let cancelled = false;
    let loadingTimer;

    setState((prev) => ({
      ...prev,
      status: "loading",
      error: null,
      showLoading: false,
    }));

    loadingTimer = setTimeout(() => {
      if (cancelled || requestId !== requestIdRef.current) return;
      setState((prev) =>
        prev.status === "loading" ? { ...prev, showLoading: true } : prev
      );
    }, LOADING_DELAY_MS);

    const load = async () => {
      try {
        const resolution = RANGE_TO_RESOLUTION[range] || "last24Hours";
        const response = await fetch(
          `/api/read/temperature/device/${encodeURIComponent(deviceId)}?range=${encodeURIComponent(range)}&resolution=${encodeURIComponent(resolution)}`
        );
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        if (cancelled || requestId !== requestIdRef.current) return;
        setState({
          status: "ready",
          current: data.current,
          points: data.points || [],
          error: null,
          showLoading: false,
        });
      } catch (error) {
        if (cancelled || requestId !== requestIdRef.current) return;
        setState((prev) => ({
          status: "error",
          current: prev.current,
          points: prev.points,
          error: error.message || String(error),
          showLoading: false,
        }));
      } finally {
        clearTimeout(loadingTimer);
      }
    };

    load();
    return () => {
      cancelled = true;
      clearTimeout(loadingTimer);
    };
  }, [deviceId, range]);

  return state;
};
