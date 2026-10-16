import { render, screen } from "@testing-library/react";

import { Calendar } from "../Calendar";

describe("Calendar", () => {
  it("видимый месяц следует за сменой selected", () => {
    const { rerender } = render(<Calendar selected={new Date(2024, 2, 12)} />);

    expect(screen.getByText("Март 2024")).toBeInTheDocument();

    rerender(<Calendar selected={new Date(2025, 6, 1)} />);

    expect(screen.getByText("Июль 2025")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "1 июля 2025" }),
    ).toBeInTheDocument();
  });

  it("на первом рендере defaultMonth/defaultYear важнее selected", () => {
    render(
      <Calendar
        selected={new Date(2024, 2, 12)}
        defaultMonth={0}
        defaultYear={2023}
      />,
    );

    expect(screen.getByText("Январь 2023")).toBeInTheDocument();
  });
});
