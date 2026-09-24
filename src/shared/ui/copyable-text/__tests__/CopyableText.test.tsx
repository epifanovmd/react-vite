import { act, fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { vi } from "vitest";

import { TooltipProvider } from "../../tooltip";
import { CopyableText } from "../CopyableText";

describe("CopyableText", () => {
  it("copies the text, stops propagation and announces the result", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const onCopied = vi.fn();
    const onRowClick = vi.fn();

    Object.assign(navigator, { clipboard: { writeText } });

    render(
      <TooltipProvider>
        <div onClick={onRowClick}>
          <CopyableText text="abc-123" onCopied={onCopied} />
        </div>
      </TooltipProvider>,
    );

    const button = screen.getByRole("button", { name: "Копировать: abc-123" });

    await act(async () => {
      fireEvent.click(button);
    });

    expect(writeText).toHaveBeenCalledWith("abc-123");
    expect(onRowClick).not.toHaveBeenCalled();
    expect(onCopied).toHaveBeenCalledTimes(1);
    expect(button).toHaveTextContent("Скопировано");
  });
});
