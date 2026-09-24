import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { vi } from "vitest";

import { Textarea } from "../Textarea";

describe("Textarea", () => {
  it("forwards ref, native props and exposes root data attributes", () => {
    const ref = React.createRef<HTMLTextAreaElement>();

    render(
      <Textarea
        aria-label="Bio"
        className="textarea-class"
        defaultValue="hello"
        name="bio"
        ref={ref}
        size="lg"
        wrapperClassName="wrapper-class"
      />,
    );

    const textarea = screen.getByRole("textbox", { name: "Bio" });
    const root = textarea.closest('[data-slot="input-root"]');

    expect(ref.current).toBe(textarea);
    expect(textarea).toHaveAttribute("name", "bio");
    expect(textarea).toHaveClass("textarea-class");
    expect(textarea).toHaveAttribute("data-slot", "input");
    expect(root).toHaveClass("wrapper-class");
    expect(root).toHaveAttribute("data-has-value", "true");
    expect(root).toHaveAttribute("data-size", "lg");
  });

  it("uses a valid vertical resize class when autosize is off", () => {
    render(<Textarea aria-label="Fixed" autoResize={false} />);

    const textarea = screen.getByRole("textbox", { name: "Fixed" });

    expect(textarea).toHaveClass("resize-y");
    expect(textarea).not.toHaveClass("resize-vertical");
  });

  it("derives aria-invalid from the error variant", () => {
    const view = render(<Textarea aria-label="Invalid" variant="error" />);
    const textarea = screen.getByRole("textbox", { name: "Invalid" });

    expect(textarea).toHaveAttribute("aria-invalid", "true");

    view.rerender(
      <Textarea aria-invalid="false" aria-label="Invalid" variant="error" />,
    );
    expect(textarea).toHaveAttribute("aria-invalid", "false");
  });

  it("tracks the uncontrolled value in the counter and data-has-value", () => {
    const onChange = vi.fn();

    render(
      <Textarea
        aria-label="Note"
        maxLength={10}
        onChange={onChange}
        showCount
      />,
    );

    const textarea = screen.getByRole("textbox", { name: "Note" });
    const root = textarea.closest('[data-slot="input-root"]');
    const counter = screen.getByText("0 / 10");

    expect(root).toHaveAttribute("data-has-value", "false");
    expect(counter).toHaveAttribute("aria-live", "polite");
    expect(textarea).toHaveAttribute("aria-describedby", counter.id);

    fireEvent.change(textarea, { target: { value: "hello" } });

    expect(onChange).toHaveBeenCalledOnce();
    expect(screen.getByText("5 / 10")).toBeInTheDocument();
    expect(root).toHaveAttribute("data-has-value", "true");
  });

  it("reflects a controlled value in the counter", () => {
    const view = render(
      <Textarea aria-label="Controlled" showCount value="abc" />,
    );

    expect(screen.getByText("3")).toBeInTheDocument();

    view.rerender(<Textarea aria-label="Controlled" showCount value="" />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("merges the counter into an existing aria-describedby", () => {
    render(
      <Textarea
        aria-describedby="hint"
        aria-label="Described"
        showCount
        value=""
      />,
    );

    const textarea = screen.getByRole("textbox", { name: "Described" });
    const counter = screen.getByText("0");

    expect(textarea).toHaveAttribute("aria-describedby", `hint ${counter.id}`);
  });

  it("supports minRows as an alias of rows", () => {
    render(<Textarea aria-label="Rows" minRows={5} />);

    expect(screen.getByRole("textbox", { name: "Rows" })).toHaveAttribute(
      "rows",
      "5",
    );
  });

  it("autosizes to its content up to maxRows", () => {
    render(
      <Textarea
        aria-label="Auto"
        defaultValue=""
        maxRows={2}
        style={{ lineHeight: "20px", paddingTop: "8px", paddingBottom: "8px" }}
      />,
    );

    const textarea = screen.getByRole("textbox", { name: "Auto" });

    Object.defineProperty(textarea, "scrollHeight", {
      configurable: true,
      value: 36,
    });
    fireEvent.input(textarea, { target: { value: "one" } });
    expect(textarea.style.height).toBe("36px");
    expect(textarea.style.overflowY).toBe("hidden");

    Object.defineProperty(textarea, "scrollHeight", {
      configurable: true,
      value: 120,
    });
    fireEvent.input(textarea, { target: { value: "one\ntwo\nthree\nfour" } });
    expect(textarea.style.height).toBe("56px");
    expect(textarea.style.overflowY).toBe("auto");
  });
});
