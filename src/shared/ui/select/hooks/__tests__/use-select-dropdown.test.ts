import { renderHook } from "@testing-library/react";
import type * as React from "react";
import { vi } from "vitest";

import { useSelectDropdown } from "../use-select-dropdown";

describe("useSelectDropdown", () => {
  it("prevents an outside interaction originating in a searchable trigger", () => {
    const trigger = document.createElement("div");
    const input = document.createElement("input");

    trigger.dataset.radixPopoverTrigger = "";
    trigger.append(input);
    const { result } = renderHook(() =>
      useSelectDropdown({ inputRef: { current: input }, search: true }),
    );
    const event = new Event("pointerdown", { cancelable: true });

    Object.defineProperty(event, "target", { value: input });
    result.current.onInteractOutside(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it("calls onScrollEnd only within the bottom threshold", () => {
    const onScrollEnd = vi.fn();
    const { result } = renderHook(() =>
      useSelectDropdown({
        inputRef: { current: null },
        onScrollEnd,
        search: false,
      }),
    );
    const element = document.createElement("div");

    Object.defineProperties(element, {
      clientHeight: { value: 100 },
      scrollHeight: { value: 300 },
      scrollTop: { configurable: true, value: 100 },
    });
    result.current.handleScroll({
      currentTarget: element,
    } as React.UIEvent<HTMLDivElement>);
    expect(onScrollEnd).not.toHaveBeenCalled();

    Object.defineProperty(element, "scrollTop", { value: 160 });
    result.current.handleScroll({
      currentTarget: element,
    } as React.UIEvent<HTMLDivElement>);
    expect(onScrollEnd).toHaveBeenCalledOnce();
  });
});
