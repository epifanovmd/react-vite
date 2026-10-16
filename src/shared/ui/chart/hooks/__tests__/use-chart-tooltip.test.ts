import { act, renderHook } from "@testing-library/react";
import type { KeyboardEvent } from "react";
import { describe, expect, it } from "vitest";

import { useChartTooltip } from "../use-chart-tooltip";

interface Props {
  positions: number[];
  tops: number[];
}

const render = (initialProps: Props) =>
  renderHook(
    ({ positions, tops }: Props) =>
      useChartTooltip({
        positions,
        originX: 0,
        topOf: index => tops[index] ?? 0,
      }),
    { initialProps },
  );

const key = (k: string) =>
  ({ key: k, preventDefault: () => undefined }) as KeyboardEvent<SVGElement>;

describe("useChartTooltip", () => {
  it("координаты пересчитываются при смене позиций и значений", () => {
    const { result, rerender } = render({
      positions: [0, 10, 20],
      tops: [5, 6, 7],
    });

    act(() => {
      result.current.handleKeyDown(key("ArrowRight"));
    });
    expect(result.current.active).toEqual({ index: 1, left: 10, top: 6 });

    rerender({ positions: [0, 30, 60], tops: [1, 2, 3] });
    expect(result.current.active).toEqual({ index: 1, left: 30, top: 2 });
  });

  it("индекс ограничивается длиной данных", () => {
    const { result, rerender } = render({
      positions: [0, 10, 20],
      tops: [5, 6, 7],
    });

    act(() => {
      result.current.handleKeyDown(key("End"));
    });
    expect(result.current.active?.index).toBe(2);

    rerender({ positions: [0, 40], tops: [1, 2] });
    expect(result.current.active).toEqual({ index: 1, left: 40, top: 2 });

    act(() => {
      result.current.handleKeyDown(key("ArrowLeft"));
    });
    expect(result.current.active?.index).toBe(0);

    rerender({ positions: [], tops: [] });
    expect(result.current.active).toBeNull();
  });

  it("Escape и hide скрывают тултип", () => {
    const { result } = render({ positions: [0, 10], tops: [1, 2] });

    act(() => {
      result.current.handleFocus();
    });
    expect(result.current.active?.index).toBe(0);

    act(() => {
      result.current.handleKeyDown(key("Escape"));
    });
    expect(result.current.active).toBeNull();
  });
});
