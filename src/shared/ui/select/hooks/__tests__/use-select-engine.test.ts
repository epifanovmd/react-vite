import { act, renderHook } from "@testing-library/react";
import * as React from "react";
import { afterEach, vi } from "vitest";

import type { ISelectRef } from "../../types";
import { useSelectEngine } from "../use-select-engine";

const options = [
  { value: "one", label: "First" },
  { value: "disabled", label: "Disabled", disabled: true },
];

describe("useSelectEngine", () => {
  afterEach(() => vi.useRealTimers());

  it("coordinates opening, selection, clearing and search reset", () => {
    vi.useFakeTimers();
    const ref = React.createRef<ISelectRef>();
    const onChange = vi.fn();
    const onOpenChange = vi.fn();
    const onSearchReset = vi.fn();
    const onSelect = vi.fn();
    const { result } = renderHook(() =>
      useSelectEngine({
        closeOnClear: false,
        onChange,
        onOpenChange,
        onSearchReset,
        onSelect,
        options,
        ref,
        searchable: true,
        value: "one",
      }),
    );

    act(() => result.current.handleOpen(true));
    expect(result.current.open).toBe(true);
    expect(onOpenChange).toHaveBeenCalledWith(true);

    act(() => result.current.clear());
    expect(onChange).toHaveBeenLastCalledWith(null);
    expect(result.current.open).toBe(true);

    act(() => result.current.select("one"));
    expect(onChange).toHaveBeenCalledWith("one");
    expect(onSelect).not.toHaveBeenCalled();
    expect(onSearchReset).toHaveBeenCalled();
    expect(result.current.open).toBe(false);

    act(() => ref.current?.blur());
    expect(ref.current?.nativeElement).toBeNull();
  });

  it("ignores disabled keyboard options and delegates scrolling", () => {
    const onChange = vi.fn();
    const onScrollEnd = vi.fn();
    const { result } = renderHook(() =>
      useSelectEngine({
        onChange,
        onScrollEnd,
        options,
        ref: null,
        value: null,
      }),
    );

    act(() => result.current.setFocusedIndex(1));
    act(() =>
      result.current.handleKeyDown({
        key: "Enter",
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent),
    );
    expect(onChange).not.toHaveBeenCalled();

    const element = document.createElement("div");

    Object.defineProperties(element, {
      clientHeight: { value: 100 },
      scrollHeight: { value: 120 },
      scrollTop: { value: 0 },
    });
    act(() =>
      result.current.handleScroll({
        currentTarget: element,
      } as React.UIEvent<HTMLDivElement>),
    );
    expect(onScrollEnd).toHaveBeenCalledOnce();
  });
});
