import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { selectItemHighlightedClasses } from "../../select-variants";
import { SelectListItem } from "../SelectListItem";

describe("SelectListItem", () => {
  it("renders state and reports mouse interactions", () => {
    const onBlur = vi.fn();
    const onFocus = vi.fn();
    const onSelect = vi.fn();

    render(
      <SelectListItem
        focused
        onBlur={onBlur}
        onFocus={onFocus}
        onSelect={onSelect}
        selected
      >
        First
      </SelectListItem>,
    );
    const option = screen.getByRole("option");

    expect(option).toHaveAttribute("aria-selected", "true");
    expect(option).toHaveClass(...selectItemHighlightedClasses.split(" "));
    expect(option.querySelector("svg")).toBeInTheDocument();

    fireEvent.mouseEnter(option);
    fireEvent.mouseLeave(option);
    fireEvent.click(option);
    expect(onFocus).toHaveBeenCalledOnce();
    expect(onBlur).toHaveBeenCalledOnce();
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("prevents pointer focus and ignores clicks when disabled", () => {
    const onSelect = vi.fn();

    render(
      <SelectListItem disabled onSelect={onSelect}>
        Disabled
      </SelectListItem>,
    );
    const option = screen.getByRole("option");
    const event = new Event("pointerdown", { bubbles: true, cancelable: true });

    option.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    fireEvent.click(option);
    expect(onSelect).not.toHaveBeenCalled();
    expect(option).toHaveClass("pointer-events-none", "opacity-50");
  });
});
