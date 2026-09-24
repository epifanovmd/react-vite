import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { vi } from "vitest";

import { FileDrop } from "../FileDrop";

const makeFile = (name: string, type: string) =>
  new File(["x"], name, { type });

const dropFiles = (target: Element, files: File[]) =>
  fireEvent.drop(target, { dataTransfer: { files } });

describe("FileDrop", () => {
  it("keeps the drag highlight while moving over child elements", () => {
    render(<FileDrop onFiles={() => {}} hint="подсказка" />);

    const zone = screen.getByRole("button");
    const hint = screen.getByText("подсказка");

    fireEvent.dragEnter(zone);
    expect(zone).toHaveAttribute("data-drag-over");

    fireEvent.dragEnter(hint);
    fireEvent.dragLeave(hint);
    expect(zone).toHaveAttribute("data-drag-over");

    fireEvent.dragLeave(zone);
    expect(zone).not.toHaveAttribute("data-drag-over");
  });

  it("applies accept on drop and reports rejected files", () => {
    const onFiles = vi.fn();
    const onReject = vi.fn();

    render(<FileDrop onFiles={onFiles} onReject={onReject} accept="image/*" />);

    const image = makeFile("a.png", "image/png");
    const doc = makeFile("b.pdf", "application/pdf");

    dropFiles(screen.getByRole("button"), [image, doc]);

    expect(onFiles).toHaveBeenCalledWith([image]);
    expect(onReject).toHaveBeenCalledWith([doc]);
  });

  it("links the hint through aria-describedby and passes inputProps", () => {
    render(
      <FileDrop
        onFiles={() => {}}
        hint="до 5 МБ"
        inputProps={{ name: "attachments" }}
      />,
    );

    const zone = screen.getByRole("button");
    const hint = screen.getByText("до 5 МБ");

    expect(zone).toHaveAttribute("aria-describedby", hint.id);
    expect(document.querySelector('input[name="attachments"]')).not.toBeNull();
  });
});
