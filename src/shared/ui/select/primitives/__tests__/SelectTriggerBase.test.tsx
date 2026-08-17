import { render, screen } from "@testing-library/react";

import { SelectTriggerBase } from "../SelectTriggerBase";

describe("SelectTriggerBase", () => {
  it("forwards ref and native props and renders the icon", () => {
    const ref = { current: null as HTMLDivElement | null };

    render(
      <SelectTriggerBase
        className="custom"
        cursorText
        data-testid="trigger"
        ref={ref}
        showClear
      >
        Content
      </SelectTriggerBase>,
    );

    expect(ref.current).toBe(screen.getByTestId("trigger"));
    expect(ref.current).toHaveClass("custom", "cursor-text");
    expect(ref.current).toHaveTextContent("Content");
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("can hide the icon and uses pointer cursor by default", () => {
    render(
      <SelectTriggerBase data-testid="trigger" hideIcon valid={false}>
        Content
      </SelectTriggerBase>,
    );

    expect(screen.getByTestId("trigger")).toHaveClass(
      "cursor-pointer",
      "focus-within:shadow-focus-error",
    );
    expect(screen.getByTestId("trigger")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.queryByRole("button")).toBeNull();
  });
});
