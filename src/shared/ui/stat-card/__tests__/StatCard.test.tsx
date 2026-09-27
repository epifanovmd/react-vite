import { render, screen } from "@testing-library/react";

import { StatCard } from "../StatCard";

describe("StatCard", () => {
  it("кладёт содержимое в секцию с отступами, а не прямо в рамку", () => {
    render(<StatCard data-testid="stat" title="Пользователи" value="1 284" />);

    const content = screen.getByText("Пользователи").closest(".p-3");

    expect(content).not.toBeNull();
    expect(content?.parentElement).toBe(screen.getByTestId("stat"));
  });
});
