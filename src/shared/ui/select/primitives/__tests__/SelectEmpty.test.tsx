import { render, screen } from "@testing-library/react";

import { SelectEmpty } from "../SelectEmpty";

describe("SelectEmpty", () => {
  it("renders the default message and custom content/classes", () => {
    const view = render(<SelectEmpty />);

    expect(screen.getByText("No options available")).toBeInTheDocument();

    view.rerender(<SelectEmpty className="custom">Nothing</SelectEmpty>);
    expect(screen.getByText("Nothing")).toHaveClass("custom");
  });
});
