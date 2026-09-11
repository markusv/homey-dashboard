import { useEffect, useRef, useState } from "react";

const RANGE_TO_RESOLUTION = {
  day: "last24Hours",
  week: "last7Days",
  month: "last31Days",
};

const LOADING_DELAY_MS = 500;

/**
 * Fetch Homey Insights for a device capability.
 * Keeps previous points while refetching to avoid flicker.
 */
export const useCapabilityInsights = (
  deviceId,
  capabilityId,
  range = "day"
) => {
  const [state, setState] = useState({
    status: "idle",
    current: null,
    points: [],
    unit: null,
    error: null,
    showLoading: false,
  });
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!deviceId || !capabilityId) return undefined;

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
        const params = new URLSearchParams({
          capability: capabilityId,
          range,
          resolution,
        });
        const response = await fetch(
          `/api/read/insights/device/${encodeURIComponent(deviceId)}?${params}`
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
          unit: data.unit ?? null,
          error: null,
          showLoading: false,
        });
      } catch (error) {
        if (cancelled || requestId !== requestIdRef.current) return;
        setState((prev) => ({
          status: "error",
          current: prev.current,
          points: prev.points,
          unit: prev.unit,
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
  }, [deviceId, capabilityId, range]);

  return state;
};
