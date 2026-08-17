import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { vi } from "vitest";

vi.mock("../../../spinner", () => ({
  Spinner: ({ size }: { size: string }) => (
    <span data-testid="spinner">{size}</span>
  ),
}));

import { OptionsList } from "../OptionsList";

const options = [
  { value: "one", label: "First" },
  { value: "two", label: "Second", disabled: true },
];

const baseProps = {
  focusedIndex: 0,
  isSelected: (value: string) => value === "one",
  listRef: React.createRef<HTMLDivElement>(),
  multi: false,
  onSelect: vi.fn(),
  options,
  setFocusedIndex: vi.fn(),
};

describe("OptionsList", () => {
  it("renders loading and empty states", () => {
    const view = render(<OptionsList {...baseProps} loading />);

    expect(screen.getByTestId("spinner")).toHaveTextContent("md");

    view.rerender(<OptionsList {...baseProps} empty="Nothing" options={[]} />);
    expect(screen.getByText("Nothing")).toBeInTheDocument();
  });

  it("renders options, custom content and delegates interactions", () => {
    const onSelect = vi.fn();
    const optionRender = vi.fn(({ option }) => `Custom ${option.label}`);
    const setFocusedIndex = vi.fn();

    render(
      <OptionsList
        {...baseProps}
        loadingMore
        onSelect={onSelect}
        optionRender={optionRender}
        setFocusedIndex={setFocusedIndex}
      />,
    );

    const first = screen.getByRole("option", { name: "Custom First" });

    expect(first).toHaveAttribute("aria-selected", "true");
    fireEvent.mouseEnter(first);
    fireEvent.mouseLeave(first);
    fireEvent.click(first);
    expect(setFocusedIndex).toHaveBeenNthCalledWith(1, 0);
    expect(setFocusedIndex).toHaveBeenNthCalledWith(2, -1);
    expect(onSelect).toHaveBeenCalledWith("one");
    expect(screen.getByTestId("spinner")).toHaveTextContent("sm");
  });

  it("uses renderOptions when supplied and forwards scroll", () => {
    const onScroll = vi.fn();
    const renderOptions = vi.fn(() => <span>Entire custom list</span>);

    render(
      <OptionsList
        {...baseProps}
        onScroll={onScroll}
        renderOptions={renderOptions}
      />,
    );

    fireEvent.scroll(screen.getByRole("listbox"));
    expect(screen.getByText("Entire custom list")).toBeInTheDocument();
    expect(renderOptions).toHaveBeenCalledWith(
      expect.objectContaining({ focusedIndex: 0 }),
    );
    expect(onScroll).toHaveBeenCalledOnce();
  });
});
