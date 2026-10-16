import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useSmoothHorizontalScroll } from "../use-smooth-horizontal-scroll";

let frames: FrameRequestCallback[] = [];

const runFrames = () => {
  for (let i = 0; i < 200 && frames.length; i++) {
    const queue = frames;

    frames = [];
    queue.forEach(cb => cb(0));
  }
};

const makeScroller = () => {
  const el = document.createElement("div");

  Object.defineProperty(el, "scrollWidth", { value: 1000 });
  Object.defineProperty(el, "clientWidth", { value: 200 });

  return el;
};

beforeEach(() => {
  frames = [];
  vi.spyOn(window, "requestAnimationFrame").mockImplementation(cb => {
    frames.push(cb);

    return frames.length;
  });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
});

afterEach(() => {
  frames = [];
});

describe("useSmoothHorizontalScroll", () => {
  it("после завершения анимации отсчёт идёт от текущей позиции, а не от старой цели", () => {
    const el = makeScroller();
    const { result } = renderHook(() =>
      useSmoothHorizontalScroll({ current: el }),
    );

    act(() => result.current.scrollBy(100));
    runFrames();
    expect(el.scrollLeft).toBe(100);

    el.scrollLeft = 300;

    act(() => result.current.scrollBy(50));
    runFrames();
    expect(el.scrollLeft).toBe(350);
  });

  it("цель ограничивается границами прокрутки", () => {
    const el = makeScroller();
    const { result } = renderHook(() =>
      useSmoothHorizontalScroll({ current: el }),
    );

    act(() => result.current.scrollToEnd());
    runFrames();
    expect(el.scrollLeft).toBe(800);

    act(() => result.current.scrollToStart());
    runFrames();
    expect(el.scrollLeft).toBe(0);
  });
});
