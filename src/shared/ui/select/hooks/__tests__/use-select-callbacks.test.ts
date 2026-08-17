import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";

import { useSelectCallbacks } from "../use-select-callbacks";

const options = [
  { value: "one", label: "First" },
  { value: "two", label: "Second" },
];

describe("useSelectCallbacks", () => {
  it("reports selection and deselection around value operations", () => {
    const handleClear = vi.fn();
    const handleRemoveTag = vi.fn();
    const handleSelect = vi.fn();
    const onDeselect = vi.fn();
    const onSelect = vi.fn();
    const { result } = renderHook(() =>
      useSelectCallbacks({
        handleClear,
        handleRemoveTag,
        handleSelect,
        onDeselect,
        onSelect,
        options,
        selectedValues: ["one"],
      }),
    );

    act(() => result.current.handleSelectWrapper("two"));
    expect(handleSelect).toHaveBeenCalledWith("two");
    expect(onSelect).toHaveBeenCalledWith("two", options[1]);

    act(() => result.current.handleSelectWrapper("one"));
    expect(onDeselect).toHaveBeenCalledWith("one", options[0]);

    act(() => result.current.handleRemoveTagWrapper("two"));
    expect(handleRemoveTag).toHaveBeenCalledWith("two");
    expect(onDeselect).toHaveBeenCalledWith("two", options[1]);

    act(() => result.current.handleClearWrapper());
    expect(onDeselect).toHaveBeenCalledWith("one", options[0]);
    expect(handleClear).toHaveBeenCalledOnce();
  });
});
