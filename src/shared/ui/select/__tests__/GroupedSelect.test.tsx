import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { vi } from "vitest";

const mocks = vi.hoisted(() => ({ select: vi.fn() }));

vi.mock("../Select", () => ({
  Select: ({
    options,
    renderOptions,
  }: {
    options: unknown[];
    renderOptions: (context: unknown) => React.ReactNode;
  }) => {
    mocks.select({ options, renderOptions });

    return (
      <div>
        {renderOptions({
          focusedIndex: 1,
          isSelected: (value: string) => value === "two",
          onSelect: (value: string) => mocks.select("selected", value),
          setFocusedIndex: (index: number) => mocks.select("focused", index),
        })}
      </div>
    );
  },
}));

vi.mock("../primitives", () => ({
  SelectListGroup: ({
    children,
    label,
  }: {
    children: React.ReactNode;
    label: string;
  }) => <section aria-label={label}>{children}</section>,
  SelectListItem: ({
    children,
    disabled,
    focused,
    onBlur,
    onFocus,
    onSelect,
    selected,
  }: {
    children: React.ReactNode;
    disabled?: boolean;
    focused?: boolean;
    onBlur: () => void;
    onFocus: () => void;
    onSelect: () => void;
    selected?: boolean;
  }) => (
    <button
      aria-pressed={selected}
      data-focused={focused || undefined}
      disabled={disabled}
      onBlur={onBlur}
      onClick={onSelect}
      onFocus={onFocus}
      type="button"
    >
      {children}
    </button>
  ),
}));

import { GroupedSelect } from "../GroupedSelect";

const groups = [
  { group: "A", options: [{ value: "one", label: "First" }] },
  {
    group: "B",
    options: [{ value: "two", label: "Second", disabled: true }],
  },
];

describe("GroupedSelect", () => {
  it("flattens groups and renders indexed grouped options", () => {
    const optionRender = vi.fn(({ option }) => `Custom ${option.label}`);

    render(<GroupedSelect groups={groups} optionRender={optionRender} />);

    expect(mocks.select).toHaveBeenCalledWith(
      expect.objectContaining({
        options: [groups[0].options[0], groups[1].options[0]],
      }),
    );
    expect(screen.getByRole("region", { name: "A" })).toBeInTheDocument();
    const second = screen.getByRole("button", { name: "Custom Second" });

    expect(second).toBeDisabled();
    expect(second).toHaveAttribute("aria-pressed", "true");
    expect(second).toHaveAttribute("data-focused", "true");
    expect(optionRender).toHaveBeenCalledWith(
      expect.objectContaining({
        disabled: true,
        focused: true,
        index: 1,
        selected: true,
      }),
    );
  });

  it("forwards focus and selection callbacks from rendered items", () => {
    render(<GroupedSelect groups={groups} />);
    const first = screen.getByRole("button", { name: "First" });

    fireEvent.focus(first);
    fireEvent.blur(first);
    fireEvent.click(first);
    expect(mocks.select).toHaveBeenCalledWith("focused", 0);
    expect(mocks.select).toHaveBeenCalledWith("focused", -1);
    expect(mocks.select).toHaveBeenCalledWith("selected", "one");
  });
});
