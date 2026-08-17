import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";

import { useLabelInValueBridge } from "../use-label-in-value-bridge";

const options = [
  { value: "one", label: "First", disabled: true },
  { value: "two", label: "Second" },
];

describe("useLabelInValueBridge", () => {
  it("passes raw values through when labelInValue is disabled", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useLabelInValueBridge({
        labelInValue: false,
        multi: false,
        onChange,
        options,
        value: "one",
      }),
    );

    expect(result.current.normalizedValue).toBe("one");
    act(() => result.current.wrappedOnChange("two", "extra"));
    expect(onChange).toHaveBeenCalledWith("two", "extra");
  });

  it("normalizes and rebuilds single labeled values", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useLabelInValueBridge({
        getLabel: value => `Cached ${value}`,
        labelInValue: true,
        multi: false,
        onChange,
        options,
        value: { value: "one", label: "Old" },
      }),
    );

    expect(result.current.normalizedValue).toBe("one");
    act(() => result.current.wrappedOnChange("one"));
    expect(onChange).toHaveBeenLastCalledWith({
      disabled: true,
      key: "one",
      label: "First",
      value: "one",
    });

    act(() => result.current.wrappedOnChange("missing"));
    expect(onChange).toHaveBeenLastCalledWith({
      key: "missing",
      label: "Cached missing",
      value: "missing",
    });

    act(() => result.current.wrappedOnChange(null));
    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it("normalizes and rebuilds arrays in multi mode", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useLabelInValueBridge({
        labelInValue: true,
        multi: true,
        onChange,
        options,
        value: [{ value: "one" }, { value: "two" }],
      }),
    );

    expect(result.current.normalizedValue).toEqual(["one", "two"]);
    act(() => result.current.wrappedOnChange(["two"]));
    expect(onChange).toHaveBeenCalledWith([
      { disabled: undefined, key: "two", label: "Second", value: "two" },
    ]);
  });
});
