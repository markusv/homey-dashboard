import { useEffect, useState } from "react";
import { IDLE_FADE_MS } from "../WeatherOverlay.constants";

export const useIdleOverlayFade = (timeoutMs = IDLE_FADE_MS) => {
  const [dimmed, setDimmed] = useState(false);

  useEffect(() => {
    let timerId;
    const onPointerDown = () => {
      setDimmed(true);
      window.clearTimeout(timerId);
      timerId = window.setTimeout(() => setDimmed(false), timeoutMs);
    };
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.clearTimeout(timerId);
    };
  }, [timeoutMs]);

  return dimmed;
};
