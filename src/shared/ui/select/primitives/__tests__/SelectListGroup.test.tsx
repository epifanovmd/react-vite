import { render, screen } from "@testing-library/react";

import { SelectListGroup } from "../SelectListGroup";

describe("SelectListGroup", () => {
  it("renders a labeled group and its children", () => {
    render(
      <SelectListGroup className="custom" label="Group A">
        <span>Option</span>
      </SelectListGroup>,
    );

    const group = screen.getByRole("group");

    expect(group).toHaveClass("custom");
    expect(screen.getByText("Group A")).toHaveAttribute("role", "presentation");
    expect(group).toHaveTextContent("Option");
  });
});
