import { agentModule } from "@entities/agent";
import { nodeModule } from "@entities/node";
import { IUserStore } from "@entities/user";
import { IMainApi } from "@shared/api";
import type { NodeDto } from "@shared/api/gen/main/model";
import { createFakeAccess } from "@shared/lib/access/testing";
import { iocContainer } from "@shared/lib/di";
import { INotificationService } from "@shared/lib/notifications";
import { ISocketTransport } from "@shared/lib/socket";
import { createFakeSocket } from "@shared/lib/socket/testing";
import { TooltipProvider } from "@shared/ui";
import { fireEvent, render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { NodesPage } from "../NodesPage";

vi.mock("@tanstack/react-router", async importOriginal => ({
  ...(await importOriginal<object>()),
  useNavigate: () => vi.fn(),
  Link: ({ children }: { children: ReactNode }) => <a href="#">{children}</a>,
}));
vi.mock("@shared/ui", async importOriginal => ({
  ...(await importOriginal<object>()),
  useConfirm: () => vi.fn(),
}));

const node = (patch: Partial<NodeDto>): NodeDto => ({
  id: "n-1",
  name: "alpha",
  description: "основной",
  host: "203.0.113.10",
  ownerId: "u-1",
  ownerName: "Анна",
  createdById: "u-2",
  createdByName: "Борис",
  agentId: "a-1",
  agentName: "alpha",
  status: "online",
  statusMessage: null,
  agent: {
    id: "a-1",
    name: "alpha",
    online: true,
    revoked: false,
    version: "1.1.0",
    address: "203.0.113.10",
    lastSeenAt: Date.now(),
    host: null,
    updateAvailable: true,
    workers: [],
  },
  config: { status: "error", pending: [], failed: ["netprobe"] },
  job: null,
  createdAt: "2026-10-01T10:00:00.000Z",
  updatedAt: "2026-10-01T10:00:00.000Z",
  ...patch,
});

const api = {
  getNodes: vi.fn(async () => ({
    data: {
      items: [
        node({}),
        node({
          id: "n-2",
          name: "beta",
          description: null,
          host: null,
          ownerId: null,
          ownerName: null,
          createdById: "u-2",
          createdByName: "Борис",
          agentId: null,
          agent: null,
          status: "created",
          config: { status: "synced", pending: [], failed: [] },
        }),
      ],
      total: 2,
    },
  })),
  getAgents: vi.fn(async () => ({
    data: {
      items: [
        {
          id: "a-1",
          name: "alpha",
          online: true,
          revoked: false,
          labels: {},
          enrolledAt: 1,
          workers: [],
          alerts: [],
          metrics: {
            at: 1,
            host: {
              cpuPercent: 42,
              memUsedBytes: 1,
              memTotalBytes: 4,
              load1: 0.5,
            },
          },
        },
      ],
      total: 1,
    },
  })),
  getNodeMesh: vi.fn(async () => ({
    data: {
      nodes: [
        { id: "n-1", name: "alpha", host: "203.0.113.10" },
        { id: "n-2", name: "beta", host: "203.0.113.11" },
      ],
      cells: [
        {
          from: "n-1",
          to: "n-2",
          method: "icmp",
          sent: 3,
          received: 3,
          rttAvgMs: 12,
          rttMinMs: 10,
          rttMaxMs: 14,
          lossPct: 0,
          at: 1,
          stale: false,
        },
      ],
      generatedAt: 1,
    },
  })),
};

let permissions: string[];

beforeEach(() => {
  permissions = ["node:view:own", "node:update:own", "node:provision:own"];
  iocContainer.bind(IMainApi.Tid).toConstantValue(api);
  iocContainer.load(nodeModule, agentModule);
  iocContainer
    .bind(IUserStore.Tid)
    .toConstantValue(createFakeAccess({ userId: "u-1", permissions }));
  iocContainer
    .bind(INotificationService.Tid)
    .toConstantValue({ success: vi.fn(), error: vi.fn() });
  iocContainer.bind(ISocketTransport.Tid).toConstantValue(createFakeSocket());
});

afterEach(() => {
  iocContainer.unbind(IMainApi.Tid);
  iocContainer.unload(nodeModule, agentModule);
  iocContainer.unbind(IUserStore.Tid);
  iocContainer.unbind(INotificationService.Tid);
  iocContainer.unbind(ISocketTransport.Tid);
});

const renderPage = () =>
  render(
    <TooltipProvider>
      <NodesPage />
    </TooltipProvider>,
  );

describe("NodesPage", () => {
  it("таблица: статус, агент, конфигурация, нагрузка и действия по строке", async () => {
    renderPage();

    const row = (await screen.findByText("alpha", { selector: "a" })).closest(
      "tr",
    ) as HTMLElement;

    expect(within(row).getByText("На связи")).toBeInTheDocument();
    expect(within(row).getByText("1.1.0")).toBeInTheDocument();
    expect(within(row).getByText("обновление")).toBeInTheDocument();
    expect(within(row).getByText("Ошибка применения")).toBeInTheDocument();
    expect(await within(row).findByText(/ЦП 42%/)).toBeInTheDocument();
    expect(within(row).getByText("создал Борис")).toBeInTheDocument();
    // Агент на связи — ставить нечего.
    expect(
      within(row).queryByRole("button", { name: "Установить агента" }),
    ).not.toBeInTheDocument();
    expect(within(row).getByRole("button", { name: "Изменить" })).toBeVisible();
    expect(
      within(row).queryByRole("button", { name: "Удалить" }),
    ).not.toBeInTheDocument();

    const other = screen.getByText("beta", { selector: "a" }).closest("tr")!;

    expect(within(other).getByText("Ожидает агента")).toBeInTheDocument();
    expect(within(other).getByText("не установлен")).toBeInTheDocument();
    expect(
      within(other).queryByRole("button", { name: "Изменить" }),
    ).not.toBeInTheDocument();

    expect(await screen.findByText("Связность узлов")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Новый узел" }),
    ).not.toBeInTheDocument();
  });

  it("поиск сужает список", async () => {
    renderPage();
    await screen.findByText("alpha", { selector: "a" });

    fireEvent.change(screen.getByRole("searchbox", { name: "Поиск узлов" }), {
      target: { value: "bet" },
    });

    expect(screen.queryByText("alpha", { selector: "a" })).toBeNull();
    expect(screen.getByText("beta", { selector: "a" })).toBeInTheDocument();
  });

  it("с правом создания — кнопка и окно нового узла", async () => {
    permissions.push("node:create");
    renderPage();

    fireEvent.click(screen.getByRole("button", { name: "Новый узел" }));
    expect(await screen.findByRole("dialog")).toHaveTextContent("Новый узел");
  });
});
