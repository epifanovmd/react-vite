import { TooltipProvider } from "@shared/ui";
import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { NodeConfigBadge } from "../NodeConfigBadge";
import { NodeOwnershipCell } from "../NodeOwnershipCell";
import { NodeStatusBadge } from "../NodeStatusBadge";

describe("NodeStatusBadge", () => {
  it("подпись статуса", () => {
    render(
      <TooltipProvider>
        <NodeStatusBadge node={{ status: "offline", statusMessage: null }} />
        <NodeStatusBadge
          node={{ status: "error", statusMessage: "Раздел netprobe: нет" }}
        />
      </TooltipProvider>,
    );

    expect(screen.getByText("Нет связи")).toBeInTheDocument();
    expect(screen.getByText("Ошибка")).toBeInTheDocument();
  });

  describe("без связи — сколько прошло, само обновляется", () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it("секунды тикают", () => {
      vi.useFakeTimers();
      vi.setSystemTime(100_000);

      render(
        <TooltipProvider>
          <NodeStatusBadge
            node={{
              status: "offline",
              statusMessage: null,
              agent: { lastSeenAt: 97_000 },
            }}
          />
        </TooltipProvider>,
      );

      expect(screen.getByText("Нет связи · 3 с назад")).toBeInTheDocument();
      for (let i = 0; i < 2; i++) {
        act(() => {
          vi.advanceTimersByTime(1000);
        });
      }
      expect(screen.getByText("Нет связи · 5 с назад")).toBeInTheDocument();
    });
  });
});

describe("NodeConfigBadge", () => {
  it("подпись сводки конфигурации", () => {
    render(
      <TooltipProvider>
        <NodeConfigBadge
          config={{ status: "synced", pending: [], failed: [] }}
        />
        <NodeConfigBadge
          config={{ status: "error", pending: [], failed: ["netprobe"] }}
        />
      </TooltipProvider>,
    );

    expect(screen.getByText("Актуальна")).toBeInTheDocument();
    expect(screen.getByText("Ошибка применения")).toBeInTheDocument();
  });
});

describe("NodeOwnershipCell", () => {
  it("владелец и другой создатель", () => {
    render(<NodeOwnershipCell owner="Анна" creator="Борис" />);

    expect(screen.getByText("Анна")).toBeInTheDocument();
    expect(screen.getByText("создал Борис")).toBeInTheDocument();
  });

  it("без владельца; создатель-владелец не повторяется", () => {
    const { rerender } = render(
      <NodeOwnershipCell owner={null} creator={null} />,
    );

    expect(screen.getByText("не назначен")).toBeInTheDocument();

    rerender(<NodeOwnershipCell owner="Анна" creator="Анна" />);
    expect(screen.queryByText(/создал/)).not.toBeInTheDocument();
  });
});
