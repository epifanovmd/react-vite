import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useControllableState } from "../use-controllable-state";

describe("useControllableState", () => {
  it("неуправляемый: два функциональных апдейтера в одном тике накапливаются", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState({ defaultValue: 0, onChange }),
    );

    act(() => {
      result.current[1](prev => prev + 1);
      result.current[1](prev => prev + 1);
    });

    expect(result.current[0]).toBe(2);
    expect(onChange).toHaveBeenLastCalledWith(2);
  });

  it("управляемый: onChange получает накопленное значение в одном тике", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState({ value: 10, defaultValue: 0, onChange }),
    );

    act(() => {
      result.current[1](prev => prev + 1);
      result.current[1](prev => prev + 1);
    });

    expect(onChange.mock.calls.map(([v]) => v)).toEqual([11, 12]);
    expect(result.current[0]).toBe(10);
  });

  it("значение-сеттер и следование за управляемым value", () => {
    const { result, rerender } = renderHook(
      ({ value }: { value?: number }) =>
        useControllableState({ value, defaultValue: 0 }),
      { initialProps: { value: 5 as number | undefined } },
    );

    expect(result.current[0]).toBe(5);
    rerender({ value: 7 });
    expect(result.current[0]).toBe(7);

    rerender({ value: undefined });
    act(() => {
      result.current[1](3);
    });
    expect(result.current[0]).toBe(3);
  });
});
