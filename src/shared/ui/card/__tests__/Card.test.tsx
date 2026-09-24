import { render, screen } from "@testing-library/react";

import { Card } from "../Card";
import { CardContent } from "../CardContent";
import { CardHeader } from "../CardHeader";
import { CardTitle } from "../CardTitle";

describe("Card", () => {
  it("не оборачивает составные секции во второй CardContent", () => {
    render(
      <Card data-testid="card">
        <CardHeader data-testid="header">
          <CardTitle>Заголовок</CardTitle>
        </CardHeader>
        <CardContent>Текст</CardContent>
      </Card>,
    );

    expect(screen.getByTestId("header").parentElement).toBe(
      screen.getByTestId("card"),
    );
  });

  it("в шорткате кладёт children в CardContent под шапкой", () => {
    render(
      <Card data-testid="card" title="Заголовок" contentClassName="content">
        Текст
      </Card>,
    );

    const card = screen.getByTestId("card");

    expect(
      screen.getByRole("heading", { name: "Заголовок" }),
    ).toBeInTheDocument();
    expect(card.lastElementChild).toHaveClass("content");
    expect(card.lastElementChild).toHaveTextContent("Текст");
  });
});
