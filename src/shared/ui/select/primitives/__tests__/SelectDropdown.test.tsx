import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { vi } from "vitest";

const mocks = vi.hoisted(() => ({ content: vi.fn() }));

vi.mock("@radix-ui/react-popover", () => ({
  Root: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Trigger: ({
    children,
    onClick,
  }: {
    children: React.ReactElement;
    onClick: React.MouseEventHandler;
  }) =>
    React.cloneElement(children, {
      onClick,
    } as React.HTMLAttributes<HTMLElement>),
}));

vi.mock("../SelectPopoverContent", () => ({
  SelectPopoverContent: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
  }) => {
    mocks.content(props);

    return <div data-testid="content">{children}</div>;
  },
}));

import { SelectDropdown } from "../SelectDropdown";

describe("SelectDropdown", () => {
  it("renders content and forwards placement and interaction props", () => {
    const onInteractOutside = vi.fn();

    render(
      <SelectDropdown
        dropdownSide="top"
        onInteractOutside={onInteractOutside}
        onOpenChange={vi.fn()}
        open
        trigger={<button type="button">Trigger</button>}
      >
        Options
      </SelectDropdown>,
    );

    expect(screen.getByTestId("content")).toHaveTextContent("Options");
    expect(mocks.content).toHaveBeenCalledWith({
      dropdownSide: "top",
      onInteractOutside,
    });
  });

  it("can hide content and prevent closing on repeated trigger click", () => {
    const view = render(
      <SelectDropdown
        closeOnTriggerClick={false}
        onOpenChange={vi.fn()}
        open
        trigger={<button type="button">Trigger</button>}
      >
        Options
      </SelectDropdown>,
    );

    const click = new MouseEvent("click", { bubbles: true, cancelable: true });

    screen.getByRole("button").dispatchEvent(click);
    expect(click.defaultPrevented).toBe(true);

    view.rerender(
      <SelectDropdown
        hidden
        onOpenChange={vi.fn()}
        open={false}
        trigger={<button type="button">Trigger</button>}
      >
        Options
      </SelectDropdown>,
    );
    expect(screen.queryByTestId("content")).toBeNull();
    fireEvent.click(screen.getByRole("button"));
  });
});
