import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { ChartSeries } from "../../chart.types";
import { useSeriesVisibility } from "../use-series-visibility";

const make = (key: string, hidden?: boolean) =>
  ({ key, label: key, value: () => 0, hidden }) as ChartSeries<unknown>;

describe("useSeriesVisibility", () => {
  it("последнюю видимую серию скрыть нельзя", () => {
    const { result } = renderHook(() =>
      useSeriesVisibility([make("a"), make("b")]),
    );

    act(() => result.current.toggle("a"));
    act(() => result.current.toggle("b"));

    expect([...result.current.hiddenKeys]).toEqual(["a"]);
  });

  it("ключи исчезнувших серий не мешают скрыть серию", () => {
    const { result, rerender } = renderHook(
      ({ series }: { series: ChartSeries<unknown>[] }) =>
        useSeriesVisibility(series),
      { initialProps: { series: [make("a"), make("b"), make("c")] } },
    );

    act(() => result.current.toggle("a"));
    rerender({ series: [make("b"), make("c")] });

    act(() => result.current.toggle("b"));
    expect([...result.current.hiddenKeys]).toEqual(["b"]);

    act(() => result.current.toggle("c"));
    expect([...result.current.hiddenKeys]).toEqual(["b"]);

    act(() => result.current.toggle("b"));
    expect([...result.current.hiddenKeys]).toEqual([]);
  });
});
