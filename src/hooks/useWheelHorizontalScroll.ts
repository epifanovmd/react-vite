import { type RefObject, useEffect } from "react";

export const useWheelHorizontalScroll = (
  ref: RefObject<HTMLElement | null>,
): void => {
  useEffect(() => {
    const el = ref.current;

    if (!el) return;

    const EASE = 0.22;
    const LINE_HEIGHT_PX = 16;

    let target = el.scrollLeft;
    let rafId: number | null = null;

    const step = () => {
      const current = el.scrollLeft;
      const diff = target - current;

      if (Math.abs(diff) < 0.5) {
        el.scrollLeft = target;
        rafId = null;

        return;
      }

      el.scrollLeft = current + diff * EASE;
      rafId = requestAnimationFrame(step);
    };

    const normalizeDelta = (event: WheelEvent) =>
      event.deltaMode === WheelEvent.DOM_DELTA_LINE
        ? event.deltaY * LINE_HEIGHT_PX
        : event.deltaY;

    const onWheel = (event: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth) return;

      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

      event.preventDefault();

      if (rafId == null) target = el.scrollLeft;

      const max = el.scrollWidth - el.clientWidth;

      target = Math.min(max, Math.max(0, target + normalizeDelta(event)));

      if (rafId == null) rafId = requestAnimationFrame(step);
    };

    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("wheel", onWheel);

      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, [ref]);
};
