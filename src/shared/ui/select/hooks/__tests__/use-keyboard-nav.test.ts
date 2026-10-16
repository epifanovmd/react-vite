import { act, renderHook } from "@testing-library/react";
import type * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { useKeyboardNav } from "../use-keyboard-nav";

const key = (k: string) =>
  ({ key: k, preventDefault: () => undefined }) as React.KeyboardEvent;

const makeOption = (navIndex: number) => {
  const el = document.createElement("div");

  el.setAttribute("role", "option");
  el.dataset.navIndex = String(navIndex);
  el.scrollIntoView = vi.fn();

  return el;
};

describe("useKeyboardNav: прокрутка по умолчанию", () => {
  it("при группах прокручивает пункт с нужным навигационным индексом, а не n-й в DOM", () => {
    const list = document.createElement("div");
    // Группы меняют порядок в DOM: навигационные индексы 2, 0, 1.
    const items = [makeOption(2), makeOption(0), makeOption(1)];

    items.forEach(item => list.appendChild(item));

    const { result } = renderHook(() =>
      useKeyboardNav({
        open: true,
        count: 3,
        isDisabled: () => false,
        onSelect: vi.fn(),
        onOpen: vi.fn(),
        onClose: vi.fn(),
      }),
    );

    result.current.listRef.current = list;

    act(() => result.current.handleKeyDown(key("ArrowDown")));

    expect(result.current.focusedIndex).toBe(0);
    expect(items[1].scrollIntoView).toHaveBeenCalledWith({ block: "nearest" });
    expect(items[0].scrollIntoView).not.toHaveBeenCalled();
  });

  it("без data-nav-index прокручивает n-й пункт списка", () => {
    const list = document.createElement("div");
    const items = [0, 1].map(() => {
      const el = document.createElement("div");

      el.setAttribute("role", "option");
      el.scrollIntoView = vi.fn();
      list.appendChild(el);

      return el;
    });

    const { result } = renderHook(() =>
      useKeyboardNav({
        open: true,
        count: 2,
        isDisabled: () => false,
        onSelect: vi.fn(),
        onOpen: vi.fn(),
        onClose: vi.fn(),
      }),
    );

    result.current.listRef.current = list;

    act(() => result.current.handleKeyDown(key("End")));

    expect(items[1].scrollIntoView).toHaveBeenCalled();
  });
});
