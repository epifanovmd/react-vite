import { render, screen } from "@testing-library/react";
import * as React from "react";

import { DatePickerTrigger } from "../DatePickerTrigger";

describe("DatePickerTrigger", () => {
  it("forwards native props, classes and ref", () => {
    const ref = React.createRef<HTMLButtonElement>();

    render(
      <DatePickerTrigger
        aria-label="Date"
        className="custom"
        ref={ref}
        size="sm"
      />,
    );
    const trigger = screen.getByRole("button", { name: "Date" });

    expect(ref.current).toBe(trigger);
    expect(trigger).toHaveAttribute("type", "button");
    expect(trigger).toHaveClass("custom", "h-8", "rounded-lg");
    expect(trigger).toHaveClass("data-[state=open]:shadow-focus");
  });

  it("derives aria-invalid from semantic variants and respects overrides", () => {
    const view = render(
      <DatePickerTrigger aria-label="Date" variant="error" />,
    );

    expect(screen.getByRole("button", { name: "Date" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );

    view.rerender(
      <DatePickerTrigger
        aria-invalid="false"
        aria-label="Date"
        variant="error"
      />,
    );
    expect(screen.getByRole("button", { name: "Date" })).toHaveAttribute(
      "aria-invalid",
      "false",
    );
  });
});
