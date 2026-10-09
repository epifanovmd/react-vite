import { agentModule } from "@entities/agent";
import { jobModule } from "@entities/job";
import { nodeModule } from "@entities/node";
import { IUserStore } from "@entities/user";
import { IMainApi } from "@shared/api";
import type { AgentDto, NodeDto } from "@shared/api/gen/main/model";
import { createFakeAccess } from "@shared/lib/access/testing";
import { iocContainer } from "@shared/lib/di";
import { INotificationService } from "@shared/lib/notifications";
import { ISocketTransport } from "@shared/lib/socket";
import { createFakeSocket } from "@shared/lib/socket/testing";
import { TooltipProvider } from "@shared/ui";
import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { NodeDetail } from "../NodeDetail";

vi.mock("@tanstack/react-router", async importOriginal => ({
  ...(await importOriginal<object>()),
  useNavigate: () => vi.fn(),
  Link: ({ children }: { children: ReactNode }) => <a href="#">{children}</a>,
}));
vi.mock("@shared/ui", async importOriginal => ({
  ...(await importOriginal<object>()),
  useConfirm: () => vi.fn(),
}));

const now = Date.now();

const agent: AgentDto = {
  id: "a-1",
  name: "alpha",
  labels: {},
  online: true,
  revoked: false,
  address: "198.51.100.7",
  version: "1.0.0",
  enrolledAt: now,
  lastSeenAt: now,
  host: { hostname: "alpha", os: "linux", arch: "amd64" },
  alerts: [],
  workers: [
    {
      name: "netprobe",
      state: "running",
      health: { ok: true },
      configs: {
        targets: {
          version: 2,
          ok: false,
          error: { code: "CONFIG_REJECTED", message: "нет цели" },
        },
      },
    },
  ],
};

const node = (patch: Partial<NodeDto> = {}): NodeDto => ({
  id: "n-1",
  name: "alpha",
  description: "основной",
  host: "203.0.113.10",
  ownerId: "u-1",
  ownerName: "Анна",
  createdById: null,
  createdByName: null,
  agentId: "a-1",
  agentName: "alpha",
  status: "error",
  statusMessage: "Настройка netprobe/targets: нет цели",
  agent: {
    id: "a-1",
    name: "alpha",
    online: true,
    revoked: false,
    version: "1.1.0",
    address: "198.51.100.7",
    lastSeenAt: now,
    host: null,
    updateAvailable: true,
    workers: [],
  },
  config: { status: "error", pending: [], failed: ["netprobe/targets"] },
  job: null,
  createdAt: "2026-10-01T10:00:00.000Z",
  updatedAt: "2026-10-01T10:00:00.000Z",
  ...patch,
});

const api = {
  getNodeById: vi.fn(async () => ({ data: node() })),
  getAgent: vi.fn(async () => ({ data: agent })),
  getAgentAlerts: vi.fn(async () => ({ data: [] })),
  getAgentRelease: vi.fn(async () => ({ data: null })),
  getAgentMetrics: vi.fn(async () => ({ data: [] })),
};

let permissions: string[];

beforeEach(() => {
  permissions = ["node:view:own", "node:agent:own", "node:provision:own"];
  iocContainer.bind(IMainApi.Tid).toConstantValue(api);
  iocContainer.load(nodeModule, agentModule, jobModule);
  iocContainer
    .bind(IUserStore.Tid)
    .toConstantValue(createFakeAccess({ userId: "u-1", permissions }));
  iocContainer
    .bind(INotificationService.Tid)
    .toConstantValue({ warning: vi.fn(), error: vi.fn(), info: vi.fn() });
  iocContainer.bind(ISocketTransport.Tid).toConstantValue(createFakeSocket());
});

afterEach(() => {
  iocContainer.unbind(IMainApi.Tid);
  iocContainer.unload(nodeModule, agentModule, jobModule);
  iocContainer.unbind(IUserStore.Tid);
  iocContainer.unbind(INotificationService.Tid);
  iocContainer.unbind(ISocketTransport.Tid);
  vi.clearAllMocks();
});

const renderDetail = () =>
  render(
    <TooltipProvider>
      <NodeDetail nodeId="n-1" />
    </TooltipProvider>,
  );

describe("NodeDetail", () => {
  it("шапка, предупреждения, сведения и вкладки агента", async () => {
    renderDetail();

    expect(
      await screen.findByRole("heading", { level: 1, name: /alpha/ }),
    ).toHaveTextContent("Ошибка");
    expect(screen.getByText("Настройки воркеров не применились")).toBeVisible();
    expect(
      screen.getByText("Агент подключается с другого адреса"),
    ).toBeInTheDocument();
    expect(screen.getByText("Анна")).toBeInTheDocument();

    expect(await screen.findByRole("tab", { name: "Обзор" })).toBeVisible();
    expect(screen.getByText("netprobe/targets")).toBeInTheDocument();
    expect(screen.getByText(/: нет цели/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Обновить агента" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Удалить агента" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Изменить" }),
    ).not.toBeInTheDocument();
    // Время работы уже в шапке — карточки нет.
    expect(screen.queryByText("Работает")).not.toBeInTheDocument();
  });

  it("агента нет — пустое состояние с установкой", async () => {
    api.getNodeById.mockResolvedValueOnce({
      data: node({
        agentId: null,
        agent: null,
        status: "created",
        statusMessage: null,
        config: { status: "synced", pending: [], failed: [] },
      }),
    });
    renderDetail();

    expect(await screen.findByText("Агент не установлен")).toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "Обзор" })).toBeNull();

    const install = screen.getAllByRole("button", {
      name: "Установить агента",
    });

    fireEvent.click(install[install.length - 1]);
    expect(await screen.findByRole("dialog")).toHaveTextContent(
      "Установка агента: alpha",
    );
    expect(screen.getByRole("tab", { name: "По SSH" })).toBeInTheDocument();
  });

  it("узла нет — сообщение", async () => {
    api.getNodeById.mockResolvedValueOnce({
      error: { message: "Не найден" },
    } as never);
    renderDetail();

    expect(await screen.findByText("Узел не найден")).toBeInTheDocument();
  });
});
