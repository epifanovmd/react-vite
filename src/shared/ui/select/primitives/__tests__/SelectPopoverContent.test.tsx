import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { vi } from "vitest";

const mocks = vi.hoisted(() => ({ content: vi.fn(), portal: vi.fn() }));

vi.mock("@radix-ui/react-popover", () => ({
  Content: ({
    children,
    onOpenAutoFocus,
    ...props
  }: {
    children: React.ReactNode;
    onOpenAutoFocus: (event: Event) => void;
  }) => {
    mocks.content(props);

    return (
      <div
        data-testid="content"
        onFocus={event => onOpenAutoFocus(event.nativeEvent)}
      >
        {children}
      </div>
    );
  },
  Portal: ({
    children,
    container,
  }: {
    children: React.ReactNode;
    container?: HTMLElement;
  }) => {
    mocks.portal({ container });

    return <div data-testid="portal">{children}</div>;
  },
}));

import { SelectPopoverContent } from "../SelectPopoverContent";

describe("SelectPopoverContent", () => {
  it("resolves placement, trigger width and prevents auto-focus", () => {
    const onOpenAutoFocus = vi.fn();

    render(
      <SelectPopoverContent
        dropdownAlign="end"
        dropdownAvoidCollisions={false}
        dropdownCollisionPadding={12}
        dropdownSide="top"
        dropdownSideOffset={9}
        onOpenAutoFocus={onOpenAutoFocus}
      >
        Options
      </SelectPopoverContent>,
    );

    expect(mocks.content).toHaveBeenCalledWith(
      expect.objectContaining({
        align: "end",
        avoidCollisions: false,
        collisionPadding: 12,
        className: expect.stringContaining(
          "w-[var(--radix-popover-trigger-width)]",
        ),
        side: "top",
        sideOffset: 9,
      }),
    );
    fireEvent.focus(screen.getByTestId("content"));
    expect(onOpenAutoFocus).toHaveBeenCalledOnce();
  });

  it("supports numeric dimensions and rendering without a portal", () => {
    render(
      <SelectPopoverContent
        dropdownContainer={null}
        dropdownMaxWidth={300}
        dropdownWidth={200}
      >
        Options
      </SelectPopoverContent>,
    );

    expect(screen.queryByTestId("portal")).toBeNull();
    expect(mocks.content).toHaveBeenCalledWith(
      expect.objectContaining({ style: { maxWidth: 300, width: 200 } }),
    );
  });
});
