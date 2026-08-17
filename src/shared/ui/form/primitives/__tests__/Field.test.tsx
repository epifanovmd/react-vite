import { fireEvent, render, screen } from "@testing-library/react";

import { Input } from "../../../input";
import { Field } from "../Field";

describe("Field", () => {
  it("renders an outside label by default", () => {
    render(
      <Field htmlFor="name" label="Name">
        <Input id="name" placeholder="Enter name" />
      </Field>,
    );

    const input = screen.getByRole("textbox", { name: "Name" });
    const field = input.closest('[data-slot="field"]');

    expect(field).toHaveAttribute("data-label-placement", "outside");
    expect(input).toHaveAttribute("placeholder", "Enter name");
    expect(field?.querySelector('[data-slot="field-control"]')).toBeNull();
  });

  it("keeps a floating label associated with its input", () => {
    render(
      <Field
        error="Required"
        htmlFor="email"
        label="Email"
        labelPlacement="floating"
        required
      >
        <Input id="email" placeholder="name@example.com" size="lg" />
      </Field>,
    );

    const input = screen.getByRole("textbox", { name: /Email/ });
    const field = input.closest('[data-slot="field"]');
    const control = field?.querySelector('[data-slot="field-control"]');

    expect(field).toHaveAttribute("data-label-placement", "floating");
    expect(control).toContainElement(input);
    expect(control).toHaveClass(
      "[&_[data-slot=input]]:placeholder:opacity-0",
      "focus-within:[&_[data-slot=input]]:placeholder:opacity-100",
    );
    expect(input).toHaveAttribute("placeholder", "name@example.com");
    expect(screen.getByText("Required")).toHaveAttribute("role", "alert");
    expect(input.closest('[data-slot="input-root"]')).toHaveAttribute(
      "data-size",
      "lg",
    );
  });

  it("exposes value presence used to keep the label floated", () => {
    render(
      <Field htmlFor="city" label="City" labelPlacement="floating">
        <Input id="city" />
      </Field>,
    );

    const input = screen.getByRole("textbox", { name: "City" });
    const inputRoot = input.closest('[data-slot="input-root"]');

    expect(inputRoot).toHaveAttribute("data-has-value", "false");

    fireEvent.change(input, { target: { value: "Moscow" } });
    expect(inputRoot).toHaveAttribute("data-has-value", "true");

    fireEvent.change(input, { target: { value: "" } });
    expect(inputRoot).toHaveAttribute("data-has-value", "false");
  });
});
