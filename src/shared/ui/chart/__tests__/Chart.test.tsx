import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Chart } from "../Chart";
import type { ChartSeries } from "../chart.types";

interface Point {
  label: string;
  a: number;
  b: number | null;
}

const DATA: Point[] = [
  { label: "Пн", a: 10, b: 4 },
  { label: "Вт", a: 20, b: null },
  { label: "Ср", a: 15, b: 9 },
];

const SERIES: ChartSeries<Point>[] = [
  { key: "a", label: "Серия A", value: point => point.a },
  { key: "b", label: "Серия B", value: point => point.b },
];

const renderChart = (
  props: Partial<React.ComponentProps<typeof Chart<Point>>> = {},
) =>
  render(
    <Chart
      data={DATA}
      series={SERIES}
      x={point => point.label}
      width={600}
      height={240}
      ariaLabel="Тестовый график"
      {...props}
    />,
  );

describe("Chart", () => {
  it("рисует по одной марке на серию и подписывает их в легенде", () => {
    const { container } = renderChart({ type: "bar" });

    // У серии B одно значение пропущено — столбец не рисуется.
    expect(container.querySelectorAll("path[fill]")).toHaveLength(5);
    expect(screen.getByRole("button", { name: "Серия A" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Серия B" })).toBeVisible();
  });

  it("клик по легенде скрывает серию, повторный — возвращает", () => {
    const { container } = renderChart({ type: "bar" });

    fireEvent.click(screen.getByRole("button", { name: "Серия B" }));
    expect(container.querySelectorAll("path[fill]")).toHaveLength(3);

    fireEvent.click(screen.getByRole("button", { name: "Серия B" }));
    expect(container.querySelectorAll("path[fill]")).toHaveLength(5);
  });

  it("не даёт скрыть последнюю видимую серию", () => {
    renderChart({ type: "bar" });

    fireEvent.click(screen.getByRole("button", { name: "Серия B" }));
    fireEvent.click(screen.getByRole("button", { name: "Серия A" }));

    expect(screen.getByRole("button", { name: "Серия A" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("показывает тултип с клавиатуры и ведёт по точкам стрелками", () => {
    renderChart();

    const overlay = screen.getByRole("application", {
      name: "Тестовый график",
    });

    fireEvent.focus(overlay);

    const tooltip = screen.getByRole("tooltip");

    expect(within(tooltip).getByText("Пн")).toBeInTheDocument();
    expect(within(tooltip).getByText("10")).toBeInTheDocument();

    fireEvent.keyDown(overlay, { key: "ArrowRight" });
    expect(
      within(screen.getByRole("tooltip")).getByText("Вт"),
    ).toBeInTheDocument();

    fireEvent.keyDown(overlay, { key: "Escape" });
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("сообщает выбранную точку в onPointClick", () => {
    const onPointClick = vi.fn();

    renderChart({ onPointClick });

    const overlay = screen.getByRole("application", {
      name: "Тестовый график",
    });

    fireEvent.focus(overlay);
    fireEvent.click(overlay);

    expect(onPointClick).toHaveBeenCalledWith(
      expect.objectContaining({ index: 0, label: "Пн" }),
    );
  });

  it("держит те же значения в таблице для скринридеров", () => {
    renderChart();

    const table = screen.getByRole("table", { name: "Тестовый график" });

    expect(within(table).getByText("Ср")).toBeInTheDocument();
    expect(within(table).getAllByText("—")).toHaveLength(1);
  });

  it("не отдаёт NaN в геометрию марок при смешанных типах и стеке", () => {
    const { container } = renderChart({
      type: "area",
      stacked: true,
      series: [
        ...SERIES,
        {
          key: "c",
          label: "Серия C",
          type: "bar",
          value: point => point.a / 2,
        },
      ],
    });

    expect(container.innerHTML).not.toContain("NaN");
  });

  it("показывает заглушку вместо осей, когда данных нет", () => {
    renderChart({ data: [], emptyText: "Нет продаж" });

    expect(screen.getByText("Нет продаж")).toBeInTheDocument();
    expect(screen.queryByRole("application")).not.toBeInTheDocument();
  });
});
