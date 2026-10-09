import type { INodeMeshDto } from "@shared/api/gen/main/model";
import { TooltipProvider } from "@shared/ui";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { NodeMeshCard } from "../NodeMeshCard";

const mesh = (patch: Partial<INodeMeshDto> = {}): INodeMeshDto => ({
  nodes: [
    { id: "n-1", name: "alpha", host: "203.0.113.10" },
    { id: "n-2", name: "beta", host: "203.0.113.11" },
    { id: "n-3", name: "gamma", host: "203.0.113.12" },
  ],
  cells: [
    {
      from: "n-1",
      to: "n-2",
      rttAvgMs: 12,
      lossPct: 0,
      method: "icmp",
      sent: 3,
      received: 3,
      rttMinMs: null,
      rttMaxMs: null,
      at: 1,
      stale: false,
    },
    {
      from: "n-3",
      to: "n-2",
      rttAvgMs: 30,
      lossPct: 20,
      method: "icmp",
      sent: 3,
      received: 3,
      rttMinMs: null,
      rttMaxMs: null,
      at: 1,
      stale: false,
    },
    {
      from: "n-1",
      to: "n-3",
      rttAvgMs: null,
      lossPct: 100,
      method: "icmp",
      sent: 3,
      received: 3,
      rttMinMs: null,
      rttMaxMs: null,
      at: 1,
      stale: false,
    },
    {
      from: "n-2",
      to: "n-1",
      rttAvgMs: 15,
      lossPct: 0,
      method: "icmp",
      sent: 3,
      received: 3,
      rttMinMs: null,
      rttMaxMs: null,
      at: 1,
      stale: true,
    },
  ],
  generatedAt: 1,
  ...patch,
});

const renderCard = (value: INodeMeshDto) =>
  render(
    <TooltipProvider>
      <NodeMeshCard mesh={value} />
    </TooltipProvider>,
  );

describe("NodeMeshCard", () => {
  it("лучший путь, потери, недоступность и устаревшее — окраской", () => {
    const { container } = renderCard(mesh());

    expect(screen.getByText("Связность узлов")).toBeInTheDocument();
    expect(screen.getByText("12").closest("td")).toHaveAttribute("data-best");
    expect(screen.getByText("12").closest("td")).toHaveClass("text-success");
    expect(screen.getByText("30").closest("td")).toHaveClass("text-warning");
    expect(screen.getByText("×").closest("td")).toHaveClass("text-destructive");
    expect(screen.getByText("15").closest("td")).toHaveAttribute("data-stale");
    expect(screen.getByText("15").closest("td")).toHaveClass("opacity-60");
    expect(container.querySelectorAll("[data-best]")).toHaveLength(1);
  });

  it("меньше двух узлов — карточки нет", () => {
    const { container } = renderCard(
      mesh({ nodes: [{ id: "n-1", name: "alpha", host: null }], cells: [] }),
    );

    expect(container).toBeEmptyDOMElement();
  });
});
