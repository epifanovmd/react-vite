import { act, renderHook } from "@testing-library/react";
import type * as React from "react";
import { vi } from "vitest";

import { useKeyboardNav } from "../use-keyboard-nav";

const keyboardEvent = (key: string) =>
  ({ key, preventDefault: vi.fn() }) as unknown as React.KeyboardEvent;

describe("useKeyboardNav", () => {
  it("bounds navigation, selects the focused item and closes", () => {
    const onClose = vi.fn();
    const onSelect = vi.fn();
    const { result } = renderHook(() =>
      useKeyboardNav({ count: 2, onClose, onSelect }),
    );

    act(() => result.current.handleKeyDown(keyboardEvent("ArrowDown")));
    act(() => result.current.handleKeyDown(keyboardEvent("ArrowDown")));
    act(() => result.current.handleKeyDown(keyboardEvent("ArrowDown")));
    expect(result.current.focusedIndex).toBe(1);

    act(() => result.current.handleKeyDown(keyboardEvent("Enter")));
    expect(onSelect).toHaveBeenCalledWith(1);

    act(() => result.current.handleKeyDown(keyboardEvent("ArrowUp")));
    expect(result.current.focusedIndex).toBe(0);
    act(() => result.current.handleKeyDown(keyboardEvent("Escape")));
    act(() => result.current.handleKeyDown(keyboardEvent("Tab")));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("scrolls the focused item into view and resets when count changes", () => {
    const { result, rerender } = renderHook(
      ({ count }) =>
        useKeyboardNav({ count, onClose: vi.fn(), onSelect: vi.fn() }),
      { initialProps: { count: 2 } },
    );
    const list = document.createElement("div");
    const item = document.createElement("div");
    const scrollIntoView = vi.fn();

    item.scrollIntoView = scrollIntoView;
    list.append(item);
    result.current.listRef.current = list;
    act(() => result.current.setFocusedIndex(0));
    expect(scrollIntoView).toHaveBeenCalledWith({ block: "nearest" });

    rerender({ count: 3 });
    expect(result.current.focusedIndex).toBe(-1);
  });
});
