import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("../../../spinner", () => ({
  Spinner: ({ size }: { size: string }) => (
    <span data-testid="spinner">{size}</span>
  ),
}));

import { SelectTriggerIcon } from "../SelectTriggerIcon";

describe("SelectTriggerIcon", () => {
  it("prioritizes loading, then clear, then chevron", () => {
    const view = render(<SelectTriggerIcon loading showClear />);

    expect(screen.getByTestId("spinner")).toHaveTextContent("sm");
    expect(screen.queryByRole("button")).toBeNull();

    view.rerender(<SelectTriggerIcon showClear />);
    expect(screen.getByRole("button")).toBeInTheDocument();

    view.rerender(<SelectTriggerIcon />);
    expect(view.container.querySelector("svg")).toBeInTheDocument();

    view.rerender(<SelectTriggerIcon hideChevron />);
    expect(view.container).toBeEmptyDOMElement();
  });

  it("prevents and stops clear interactions", () => {
    const onParentClick = vi.fn();
    const onClear = vi.fn();

    render(
      <div onClick={onParentClick}>
        <SelectTriggerIcon onClear={onClear} showClear />
      </div>,
    );
    const button = screen.getByRole("button");
    const event = new Event("pointerdown", { bubbles: true, cancelable: true });

    button.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    fireEvent.click(button);
    expect(onClear).toHaveBeenCalledOnce();
    expect(onParentClick).not.toHaveBeenCalled();
  });
});
