import { act, renderHook } from "@testing-library/react";
import { afterEach, vi } from "vitest";

import { useAsyncOptions } from "../use-async-options";

const flush = async () => {
  await act(async () => {
    await vi.runAllTimersAsync();
  });
};

describe("useAsyncOptions", () => {
  afterEach(() => vi.useRealTimers());

  it("loads on open and debounces non-empty queries", async () => {
    vi.useFakeTimers();
    const fetch = vi.fn(async (query: string) => [query || "initial"]);
    const { result } = renderHook(() =>
      useAsyncOptions({
        debounce: 100,
        fetch,
        getOption: value => ({ value, label: value }),
      }),
    );

    act(() => result.current.onOpenChange?.(true));
    await flush();
    expect(fetch).toHaveBeenCalledWith("", expect.any(AbortSignal));
    expect(result.current.options[0].value).toBe("initial");

    act(() => result.current.onSearch?.("query"));
    await act(async () => vi.advanceTimersByTimeAsync(99));
    expect(fetch).toHaveBeenCalledTimes(1);
    await act(async () => vi.advanceTimersByTimeAsync(1));
    expect(fetch).toHaveBeenLastCalledWith("query", expect.any(AbortSignal));
  });

  it("honors minQueryLength and fetchOnMount", async () => {
    vi.useFakeTimers();
    const fetch = vi.fn(async () => ["mounted"]);
    const { result } = renderHook(() =>
      useAsyncOptions({
        fetch,
        fetchOnMount: true,
        getOption: value => ({ value, label: value }),
        minQueryLength: 3,
      }),
    );

    await flush();
    expect(fetch).toHaveBeenCalledOnce();
    expect(result.current.options[0].value).toBe("mounted");

    act(() => {
      result.current.onOpenChange?.(true);
      result.current.onSearch?.("ab");
    });
    await flush();
    expect(fetch).toHaveBeenCalledOnce();
  });

  it("смена fetchKey при открытом списке перезагружает опции", async () => {
    vi.useFakeTimers();
    let key = 1;
    const fetch = vi.fn(async (query: string) => [`${query}-${key}`]);
    const { result, rerender } = renderHook(
      ({ fetchKey }: { fetchKey: number }) =>
        useAsyncOptions({
          fetch,
          fetchKey,
          loadOnce: true,
          getOption: value => ({ value, label: value }),
        }),
      { initialProps: { fetchKey: 1 } },
    );

    act(() => result.current.onOpenChange?.(true));
    await flush();
    expect(fetch).toHaveBeenCalledOnce();
    expect(result.current.options[0].value).toBe("-1");

    key = 2;
    rerender({ fetchKey: 2 });
    await flush();
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(result.current.options[0].value).toBe("-2");
  });
});
