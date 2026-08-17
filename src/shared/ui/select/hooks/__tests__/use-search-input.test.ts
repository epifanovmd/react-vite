import { renderHook } from "@testing-library/react";
import type * as React from "react";
import { vi } from "vitest";

import { selectSearchInputClasses } from "../../select-variants";
import { useSearchInput } from "../use-search-input";

describe("useSearchInput", () => {
  it("builds input props and handles change and pointer interaction", () => {
    const inputRef = { current: null };
    const handleKeyDown = vi.fn();
    const setQuery = vi.fn();
    const { result } = renderHook(() =>
      useSearchInput({ handleKeyDown, inputRef, open: true, setQuery }),
    );
    const props = result.current.searchInputProps;
    const stopPropagation = vi.fn();

    expect(props.className).toBe(selectSearchInputClasses);
    expect(props.readOnly).toBe(false);
    props.onChange?.({
      target: { value: "query" },
    } as React.ChangeEvent<HTMLInputElement>);
    props.onPointerDown?.({
      stopPropagation,
    } as unknown as React.PointerEvent<HTMLInputElement>);

    expect(setQuery).toHaveBeenCalledWith("query");
    expect(stopPropagation).toHaveBeenCalledOnce();
    expect(props.onKeyDown).toBe(handleKeyDown);
  });

  it("is read-only and does not stop pointer events while closed", () => {
    const stopPropagation = vi.fn();
    const { result } = renderHook(() =>
      useSearchInput({
        handleKeyDown: vi.fn(),
        inputRef: { current: null },
        open: false,
        setQuery: vi.fn(),
      }),
    );

    expect(result.current.searchInputProps.readOnly).toBe(true);
    result.current.searchInputProps.onPointerDown?.({
      stopPropagation,
    } as unknown as React.PointerEvent<HTMLInputElement>);
    expect(stopPropagation).not.toHaveBeenCalled();
  });
});
