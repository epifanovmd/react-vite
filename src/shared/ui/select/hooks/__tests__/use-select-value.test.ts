import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";

import { useSelectValue } from "../use-select-value";

describe("useSelectValue", () => {
  it("selects, clears and closes a single value", () => {
    const close = vi.fn();
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useSelectValue<string>({ close, multi: false, onChange, value: "one" }),
    );

    expect(result.current.selectedValues).toEqual(["one"]);
    expect(result.current.isSelected("one")).toBe(true);
    expect(result.current.hasValue).toBe(true);

    act(() => result.current.handleSelect("two"));
    expect(onChange).toHaveBeenLastCalledWith("two");
    expect(close).toHaveBeenCalledOnce();

    act(() => result.current.handleClear());
    expect(onChange).toHaveBeenLastCalledWith(null);
    expect(close).toHaveBeenCalledTimes(2);
  });

  it("toggles multi values and can keep the dropdown open on clear", () => {
    const close = vi.fn();
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useSelectValue<string>({
        close,
        closeOnClear: false,
        multi: true,
        onChange,
        value: ["one", "two"],
      }),
    );

    act(() => result.current.handleSelect("one"));
    expect(onChange).toHaveBeenLastCalledWith(["two"]);
    act(() => result.current.handleSelect("three"));
    expect(onChange).toHaveBeenLastCalledWith(["one", "two", "three"]);
    act(() => result.current.handleRemoveTag("two"));
    expect(onChange).toHaveBeenLastCalledWith(["one"]);
    act(() => result.current.handleClear());
    expect(onChange).toHaveBeenLastCalledWith([]);
    expect(close).not.toHaveBeenCalled();
  });
});
