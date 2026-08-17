import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { vi } from "vitest";

import { Input } from "../Input";

describe("Input", () => {
  it("preserves native input props, type and forwarded ref", () => {
    const ref = React.createRef<HTMLInputElement>();

    render(
      <Input
        aria-label="Email"
        className="root-class"
        inputClassName="input-class"
        name="email"
        ref={ref}
        type="email"
      />,
    );

    const input = screen.getByRole("textbox", { name: "Email" });
    const root = input.closest('[data-slot="input-root"]');

    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("name", "email");
    expect(input).toHaveClass("input-class");
    expect(root).toHaveClass("root-class");
    expect(root?.querySelector('[data-slot="input-actions"]')).toBeNull();
  });

  it("tracks an uncontrolled value and clears it through native onChange", () => {
    const onChange = vi.fn();
    const onClear = vi.fn();

    render(
      <Input
        aria-label="Search"
        clearAriaLabel="Очистить"
        clearable
        onChange={onChange}
        onClear={onClear}
      />,
    );

    const input = screen.getByRole("textbox", { name: "Search" });

    expect(screen.queryByRole("button", { name: "Очистить" })).toBeNull();
    fireEvent.change(input, { target: { value: "query" } });

    const clearButton = screen.getByRole("button", { name: "Очистить" });
    const pointerDown = new Event("pointerdown", {
      bubbles: true,
      cancelable: true,
    });

    clearButton.dispatchEvent(pointerDown);
    expect(pointerDown.defaultPrevented).toBe(true);

    fireEvent.click(clearButton);
    expect(input).toHaveValue("");
    expect(input).toHaveFocus();
    expect(onChange).toHaveBeenLastCalledWith(expect.any(Object));
    expect(onChange.mock.calls.at(-1)?.[0].target).toHaveValue("");
    expect(onClear).toHaveBeenCalledOnce();
    expect(screen.queryByRole("button", { name: "Очистить" })).toBeNull();
  });

  it("clears a controlled input through its change contract", () => {
    const changedValues: string[] = [];
    const onChange = vi.fn((event: React.ChangeEvent<HTMLInputElement>) => {
      changedValues.push(event.currentTarget.value);
    });

    render(
      <Input
        aria-label="Controlled"
        clearable
        onChange={onChange}
        value="value"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Clear input" }));

    expect(onChange).toHaveBeenCalledOnce();
    expect(changedValues).toEqual([""]);
  });

  it("toggles password visibility with an accessible state", () => {
    render(
      <Input
        aria-label="Password"
        defaultValue="secret"
        hidePasswordAriaLabel="Скрыть пароль"
        showPasswordAriaLabel="Показать пароль"
        type="password"
      />,
    );

    const input = screen.getByLabelText("Password");
    const toggle = screen.getByRole("button", { name: "Показать пароль" });

    expect(input).toHaveAttribute("type", "password");
    expect(toggle).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(toggle);
    expect(input).toHaveAttribute("type", "text");
    expect(
      screen.getByRole("button", { name: "Скрыть пароль" }),
    ).toHaveAttribute("aria-pressed", "true");

    fireEvent.change(input, { target: { value: "" } });
    expect(input).toHaveAttribute("type", "password");
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("exposes loading and validation states accessibly", () => {
    const view = render(
      <Input
        aria-label="Loading field"
        clearable
        loading
        value="value"
        variant="error"
      />,
    );

    const input = screen.getByRole("textbox", { name: "Loading field" });

    expect(input).toHaveAttribute("aria-busy", "true");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();

    view.rerender(
      <Input
        aria-busy="false"
        aria-invalid="false"
        aria-label="Loading field"
        loading
        variant="error"
      />,
    );
    expect(input).toHaveAttribute("aria-busy", "false");
    expect(input).toHaveAttribute("aria-invalid", "false");
  });

  it("keeps the semantic focus ring for an open composite field", () => {
    render(
      <Input aria-label="Composite" data-state="open" variant="filled-error" />,
    );

    expect(screen.getByRole("textbox", { name: "Composite" })).toHaveClass(
      "data-[state=open]:shadow-focus-error",
    );
  });

  it("does not expose mutating actions for disabled or read-only fields", () => {
    const view = render(
      <Input aria-label="Disabled" clearable disabled value="value" />,
    );

    expect(screen.getByRole("textbox", { name: "Disabled" })).toBeDisabled();
    expect(screen.queryByRole("button")).toBeNull();

    view.rerender(
      <Input aria-label="Read only" clearable readOnly value="value" />,
    );
    expect(screen.getByRole("textbox", { name: "Read only" })).toHaveAttribute(
      "readonly",
    );
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("supports externally managed DOM values through hasValue", () => {
    const onClear = vi.fn();

    render(<Input aria-label="Masked" clearable hasValue onClear={onClear} />);

    fireEvent.click(screen.getByRole("button", { name: "Clear input" }));
    expect(onClear).toHaveBeenCalledOnce();
  });

  it("prioritizes actions over the right icon and keeps icons non-interactive", () => {
    const view = render(
      <Input
        aria-label="Decorated"
        leftIcon={<span>Left</span>}
        rightIcon={<span>Right</span>}
      />,
    );
    const input = screen.getByRole("textbox", { name: "Decorated" });
    const root = input.closest('[data-slot="input-root"]');

    expect(root?.querySelector('[data-slot="input-left-icon"]')).toHaveClass(
      "pointer-events-none",
    );
    expect(root?.querySelector('[data-slot="input-right-icon"]')).toHaveClass(
      "pointer-events-none",
    );
    expect(input).toHaveClass("pl-10", "pr-10");

    view.rerender(
      <Input
        aria-label="Decorated"
        clearable
        rightIcon={<span>Right</span>}
        value="value"
      />,
    );
    expect(root?.querySelector('[data-slot="input-right-icon"]')).toBeNull();
    expect(screen.getByRole("button", { name: "Clear input" })).toBeVisible();
  });
});
