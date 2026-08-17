import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { SelectTriggerContent } from "../SelectTriggerContent";

const baseProps = {
  disabled: false,
  getLabel: (value: string) =>
    ({ one: "First", two: "Second", three: "Third" })[value],
  hasValue: true,
  multi: false,
  onRemoveTag: vi.fn(),
  open: false,
  placeholder: "Choose",
  query: "search",
  search: false,
  searchInputProps: {},
  selectedValues: ["one"],
  tagsDisplay: true,
};

describe("SelectTriggerContent", () => {
  it("renders single display and searchable states", () => {
    const view = render(<SelectTriggerContent {...baseProps} />);

    expect(screen.getByText("First")).toBeInTheDocument();

    view.rerender(<SelectTriggerContent {...baseProps} open search />);
    expect(screen.getByRole("textbox")).toHaveValue("search");
    expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", "First");

    view.rerender(
      <SelectTriggerContent
        {...baseProps}
        hasValue={false}
        selectedValues={[]}
      />,
    );
    expect(screen.getByText("Choose")).toHaveClass("text-muted-foreground");
  });

  it("renders multi tags, removes values and reports overflow", () => {
    const onRemoveTag = vi.fn();

    render(
      <SelectTriggerContent
        {...baseProps}
        maxTagCount={2}
        multi
        onRemoveTag={onRemoveTag}
        selectedValues={["one", "two", "three"]}
      />,
    );

    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
    expect(screen.queryByText("Third")).toBeNull();
    expect(screen.getByText("+1")).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole("button")[0]);
    expect(onRemoveTag).toHaveBeenCalledWith("one");
  });

  it("supports comma display with and without search", () => {
    const view = render(
      <SelectTriggerContent
        {...baseProps}
        multi
        selectedValues={["one", "two"]}
        tagsDisplay={false}
      />,
    );

    expect(screen.getByText("First, Second")).toBeInTheDocument();

    view.rerender(
      <SelectTriggerContent
        {...baseProps}
        multi
        search
        selectedValues={["one", "two"]}
        tagsDisplay={false}
      />,
    );
    expect(screen.getByRole("textbox")).toHaveValue("First, Second");
  });
});
