import { renderHook } from "@testing-library/react";
import * as React from "react";
import { vi } from "vitest";

import type { ISelectRef } from "../../types";
import { useSelectRef } from "../use-select-ref";

describe("useSelectRef", () => {
  it("exposes focus, blur, scrolling and the native trigger", () => {
    const apiRef = React.createRef<ISelectRef>();
    const input = document.createElement("input");
    const trigger = document.createElement("div");
    const list = document.createElement("div");
    const item = document.createElement("div");
    const handleOpen = vi.fn();
    const scrollIntoView = vi.fn();

    input.focus = vi.fn();
    input.blur = vi.fn();
    trigger.focus = vi.fn();
    trigger.blur = vi.fn();
    item.scrollIntoView = scrollIntoView;
    list.append(item);

    const props = {
      handleOpen,
      inputRef: { current: input },
      listRef: { current: list },
      ref: apiRef,
      search: true,
      triggerRef: { current: trigger },
    };

    const hook = renderHook(
      ({ search }) => useSelectRef({ ...props, search }),
      {
        initialProps: { search: true },
      },
    );

    apiRef.current?.focus();
    expect(handleOpen).toHaveBeenCalledWith(true);
    expect(input.focus).toHaveBeenCalledOnce();
    apiRef.current?.blur();
    expect(input.blur).toHaveBeenCalledOnce();
    expect(trigger.blur).toHaveBeenCalledOnce();
    apiRef.current?.scrollTo(0);
    expect(scrollIntoView).toHaveBeenCalledWith({ block: "nearest" });
    expect(apiRef.current?.nativeElement).toBe(trigger);

    hook.rerender({ search: false });
    apiRef.current?.focus();
    expect(trigger.focus).toHaveBeenCalledOnce();
  });
});
