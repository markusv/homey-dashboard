import { useEffect, useState } from "react";
import { clampOffset, nextSwipeOffset } from "../helpers/nextSwipeOffset";

const INERTIA_DECAY = 0.92;
const INERTIA_STOP = 0.02;
const FRAME_MS = 16;

export const useWeatherStripSwipe = () => {
  const [viewport, setViewport] = useState(null);
  const [track, setTrack] = useState(null);

  useEffect(() => {
    if (!viewport || !track) return undefined;

    let offset = 0;
    let drag = null;
    let frame = 0;

    const maxOffset = () =>
      Math.max(0, track.scrollWidth - viewport.clientWidth);

    const apply = (next) => {
      offset = clampOffset(next, maxOffset());
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
    };

    const stopInertia = () => {
      if (!frame) return;
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const onPointerDown = (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      stopInertia();
      drag = {
        id: event.pointerId,
        startX: event.clientX,
        startOffset: offset,
        lastX: event.clientX,
        lastTime: event.timeStamp,
        velocity: 0,
      };
      try {
        viewport.setPointerCapture(event.pointerId);
      } catch {
        // The pointer can already be gone on a quick tap.
      }
    };

    const onPointerMove = (event) => {
      if (!drag || event.pointerId !== drag.id) return;
      const elapsed = event.timeStamp - drag.lastTime;
      if (elapsed > 0) {
        drag.velocity = (event.clientX - drag.lastX) / elapsed;
      }
      drag.lastX = event.clientX;
      drag.lastTime = event.timeStamp;
      apply(
        nextSwipeOffset(
          drag.startOffset,
          event.clientX - drag.startX,
          maxOffset()
        )
      );
    };

    const release = (event) => {
      if (!drag || event.pointerId !== drag.id) return;
      if (viewport.hasPointerCapture?.(event.pointerId)) {
        viewport.releasePointerCapture(event.pointerId);
      }
    };

    const onPointerUp = (event) => {
      if (!drag || event.pointerId !== drag.id) return;
      let velocity = drag.velocity;
      release(event);
      drag = null;
      const step = () => {
        velocity *= INERTIA_DECAY;
        if (Math.abs(velocity) < INERTIA_STOP) {
          frame = 0;
          return;
        }
        apply(offset - velocity * FRAME_MS);
        frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    };

    const onPointerCancel = (event) => {
      if (!drag || event.pointerId !== drag.id) return;
      release(event);
      drag = null;
      stopInertia();
    };

    const onWheel = (event) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      stopInertia();
      apply(offset + event.deltaX);
    };

    viewport.addEventListener("pointerdown", onPointerDown);
    viewport.addEventListener("pointermove", onPointerMove);
    viewport.addEventListener("pointerup", onPointerUp);
    viewport.addEventListener("pointercancel", onPointerCancel);
    viewport.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      stopInertia();
      viewport.removeEventListener("pointerdown", onPointerDown);
      viewport.removeEventListener("pointermove", onPointerMove);
      viewport.removeEventListener("pointerup", onPointerUp);
      viewport.removeEventListener("pointercancel", onPointerCancel);
      viewport.removeEventListener("wheel", onWheel);
    };
  }, [viewport, track]);

  return { viewportRef: setViewport, trackRef: setTrack };
};
