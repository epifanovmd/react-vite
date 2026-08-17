import { fireEvent, render, screen } from "@testing-library/react";
import { afterAll, beforeAll, vi } from "vitest";

import { Segmented } from "../Segmented";

const options = [
  { value: "compact", label: "Compact" },
  { value: "comfortable", label: "Comfortable" },
];

beforeAll(() => {
  HTMLElement.prototype.scrollIntoView = vi.fn();
});

afterAll(() => {
  delete (HTMLElement.prototype as Partial<HTMLElement>).scrollIntoView;
});

describe("Segmented", () => {
  it("keeps one persistent indicator when selection changes", () => {
    const { container, rerender } = render(
      <Segmented options={options} value="compact" />,
    );
    const indicator = container.querySelector(
      '[data-slot="segmented-indicator"]',
    );

    rerender(<Segmented options={options} value="comfortable" />);

    expect(container.querySelector('[data-slot="segmented-indicator"]')).toBe(
      indicator,
    );
    expect(indicator).toHaveClass("top-0", "left-0");
    expect(indicator?.closest("button")).toBeNull();
  });

  it("reports the selected value", () => {
    const onChange = vi.fn();

    render(<Segmented options={options} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Comfortable" }));

    expect(onChange).toHaveBeenCalledWith("comfortable");
  });
});
