import { agentModule, IAgentsStore } from "@entities/agent";
import { IUserStore } from "@entities/user";
import { IMainApi, IMainSession } from "@shared/api";
import type { AgentDto } from "@shared/api/gen/main/model";
import { createFakeAccess } from "@shared/lib/access/testing";
import { iocContainer } from "@shared/lib/di";
import { INotificationService } from "@shared/lib/notifications";
import { ISocketTransport } from "@shared/lib/socket";
import { createFakeSocket, type IFakeSocket } from "@shared/lib/socket/testing";
import { TooltipProvider } from "@shared/ui";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { TAgentTab } from "../../model/tabs";
import type { IAgentTabsAccess } from "../../model/types";
import { AgentTabs } from "../AgentTabs";

vi.mock("@shared/ui", async importOriginal => ({
  ...(await importOriginal<object>()),
  useConfirm: () => vi.fn(),
}));

vi.mock("@tanstack/react-router", async importOriginal => ({
  ...(await importOriginal<object>()),
  Link: ({ children }: { children: ReactNode }) => <a href="#">{children}</a>,
}));

const now = Date.now();

const agent = {
  id: "a-1",
  name: "alpha",
  labels: { zone: "eu" },
  online: true,
  revoked: false,
  enrolledAt: now,
  version: "1.0.0",
  host: { hostname: "alpha", os: "linux", arch: "amd64", kernel: "6.8.0" },
  alerts: [],
  outbox: 0,
  metrics: {
    at: now,
    host: { cpuPercent: 10, uptimeSec: 3600 },
    workers: { echo: { done: 7 } },
  },
  workers: [
    {
      name: "echo",
      state: "running",
      version: "1.0.0",
      health: { ok: true, busy: true, message: "работа 42" },
      pending: "restart",
      manifest: {
        version: "1.0.0",
        description: "Эхо для проверки",
        configs: [
          {
            key: "settings",
            description: "Префикс ответа",
            schema: {
              type: "object",
              properties: { prefix: { type: "string" } },
            },
          },
        ],
        routes: [{ method: "POST", path: "/echo", description: "Эхо" }],
        events: [{ type: "echo.done" }],
        jobs: [
          {
            type: "echo.long",
            description: "Долгая задача",
            schema: { type: "object" },
          },
        ],
      },
      configs: {
        settings: {
          version: 2,
          ok: false,
          error: { code: "CONFIG_REJECTED", message: "плохой префикс" },
        },
      },
    },
    {
      name: "broken",
      state: "invalid",
      message: "GET /manifest: 404",
    },
    { name: "sysmetrics", state: "running", builtin: true },
  ],
} as unknown as AgentDto;

const api = {
  getAgent: vi.fn(),
  getAgentMetrics: vi.fn(async () => ({ data: [] })),
  getAgentEvents: vi.fn(async () => ({
    data: {
      items: [
        {
          id: "e-1",
          agentId: "a-1",
          worker: "echo",
          type: "echo.done",
          data: { jobId: "1234567890", echo: "привет" },
          at: now,
          receivedAt: now,
        },
      ],
      nextCursor: null,
    },
  })),
  getAgentConfigs: vi.fn(async () => ({
    data: [
      {
        worker: "echo",
        key: "settings",
        config: {
          agentId: "a-1",
          worker: "echo",
          key: "settings",
          version: 2,
          data: { prefix: "!" },
          updatedAt: now,
        },
        status: {
          agentId: "a-1",
          worker: "echo",
          key: "settings",
          version: 2,
          state: "failed",
          error: { code: "CONFIG_REJECTED", message: "плохой префикс" },
        },
      },
    ],
  })),
};

const toast = { success: vi.fn(), error: vi.fn(), info: vi.fn() };
let socket: IFakeSocket;

const none: IAgentTabsAccess = {
  canManage: false,
  canConfig: false,
  canFetch: false,
  canLogs: false,
};

beforeEach(() => {
  iocContainer.bind(IMainApi.Tid).toConstantValue(api);
  iocContainer.bind(IMainSession.Tid).toConstantValue({ accessToken: "t" });
  iocContainer.load(agentModule);
  iocContainer.bind(IUserStore.Tid).toConstantValue(createFakeAccess());
  iocContainer.bind(INotificationService.Tid).toConstantValue(toast);
  socket = createFakeSocket();
  iocContainer.bind(ISocketTransport.Tid).toConstantValue(socket);
});

afterEach(() => {
  iocContainer.unbind(IMainApi.Tid);
  iocContainer.unbind(IMainSession.Tid);
  iocContainer.unload(agentModule);
  iocContainer.unbind(IUserStore.Tid);
  iocContainer.unbind(INotificationService.Tid);
  iocContainer.unbind(ISocketTransport.Tid);
});

const renderTab = (
  value: TAgentTab,
  access: IAgentTabsAccess,
  shown: AgentDto = agent,
) =>
  render(
    <TooltipProvider>
      <AgentTabs
        agent={shown}
        access={access}
        value={value}
        onValueChange={vi.fn()}
      />
    </TooltipProvider>,
  );

describe("AgentTabs", () => {
  it("набор вкладок: «Запрос» — только с правом", () => {
    const { unmount } = renderTab("overview", none);

    expect(screen.getAllByRole("tab").map(tab => tab.textContent)).toEqual([
      "Обзор",
      "Воркеры",
      "Настройки",
      "События",
      "Журнал",
    ]);
    unmount();

    renderTab("overview", { ...none, canFetch: true });
    expect(screen.getByRole("tab", { name: "Запрос" })).toBeInTheDocument();
  });

  it("обзор: метрики узла и сведения, которых нет в шапке", () => {
    renderTab("overview", none);

    expect(screen.getAllByText("Процессор").length).toBeGreaterThan(0);
    expect(screen.getByText("6.8.0")).toBeInTheDocument();
    expect(screen.getByText("1 ч 0 мин")).toBeInTheDocument();
    // Имя узла и адрес — в шапке страницы, не здесь.
    expect(screen.queryByText("Имя узла")).toBeNull();
  });

  it("воркеры: причина invalid, занят и ждёт замены, встроенный — без действий", () => {
    renderTab("workers", { ...none, canManage: true });

    const rows = screen.getAllByRole("row");
    const echo = rows.find(row => row.textContent?.includes("echo"))!;
    const broken = rows.find(row => row.textContent?.includes("broken"))!;
    const builtin = rows.find(row => row.textContent?.includes("sysmetrics"))!;

    expect(within(echo).getByText("занят")).toBeInTheDocument();
    expect(
      within(echo).getByText("перезапуск — когда освободится"),
    ).toBeInTheDocument();
    expect(
      within(echo).getByRole("button", { name: "Заменить сейчас" }),
    ).toBeVisible();
    expect(within(broken).getByText("GET /manifest: 404")).toBeInTheDocument();
    expect(within(builtin).getByText("встроенный")).toBeInTheDocument();
    expect(
      within(builtin).queryByRole("button", { name: "Перезапустить" }),
    ).toBeNull();
  });

  it("воркеры: раскрытая строка — манифест и метрики", () => {
    renderTab("workers", none);

    const echo = screen
      .getAllByRole("row")
      .find(row => row.textContent?.includes("echo"))!;

    fireEvent.click(within(echo).getAllByRole("button")[0]);

    expect(screen.getByText("Эхо для проверки")).toBeInTheDocument();
    expect(screen.getByText("POST /echo")).toBeInTheDocument();
    expect(screen.getByText("echo.done")).toBeInTheDocument();
    expect(screen.getByText("Задачи · 1")).toBeInTheDocument();
    expect(screen.getByText("echo.long")).toBeInTheDocument();
    expect(screen.getByText("Долгая задача")).toBeInTheDocument();
    expect(screen.getByText("плохой префикс")).toBeInTheDocument();
    expect(screen.getByText("done")).toBeInTheDocument();
  });

  it("отложенная замена из ответа — в строке до итога; итог — тост и снятие", async () => {
    const free = {
      ...agent,
      workers: [{ ...agent.workers[0], pending: undefined }],
    } as AgentDto;
    const store = IAgentsStore.getInstance();

    api.getAgent.mockResolvedValue({ data: free });
    act(() =>
      store.trackDeferred({
        actionId: "act-1",
        agentId: "a-1",
        worker: "echo",
        pending: "update",
      }),
    );
    renderTab("workers", { ...none, canManage: true }, free);

    expect(
      screen.getByText("обновление — когда освободится"),
    ).toBeInTheDocument();

    act(() =>
      socket.fire("agent:action", {
        id: "act-1",
        agentId: "a-1",
        name: "worker.update",
        args: { name: "echo" },
        status: "done",
        result: { version: "1.1.0" },
        createdAt: 1,
        finishedAt: 2,
        deferred: true,
      }),
    );
    expect(toast.success).toHaveBeenCalledWith(
      "Воркер «echo» обновлён: версия 1.1.0",
    );
    await waitFor(() =>
      expect(screen.queryByText("обновление — когда освободится")).toBeNull(),
    );
    expect(api.getAgent).toHaveBeenCalledWith("a-1");
  });

  it("без связи: состояние воркеров неизвестно, без действий", () => {
    renderTab(
      "workers",
      { ...none, canManage: true },
      {
        ...agent,
        online: false,
      },
    );

    expect(screen.getByText("Агент без связи")).toBeInTheDocument();
    expect(screen.getAllByText("неизвестно").length).toBeGreaterThan(0);
    expect(screen.queryByRole("button", { name: "Перезапустить" })).toBeNull();
  });

  it("настройки: ключи из манифеста, ошибка применения; удаление — с правом", async () => {
    const { unmount } = renderTab("configs", none);

    expect(await screen.findByText("Префикс ответа")).toBeInTheDocument();
    expect(
      screen.getByText("CONFIG_REJECTED: плохой префикс"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Ключи появятся, когда воркер ответит на GET /manifest.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Удалить settings" }),
    ).toBeNull();
    unmount();

    renderTab("configs", { ...none, canConfig: true });
    expect(
      await screen.findByRole("button", { name: "Удалить settings" }),
    ).toBeInTheDocument();
  });

  it("запрос: маршруты воркера из манифеста", () => {
    renderTab("fetch", { ...none, canFetch: true });

    expect(screen.getByText("Маршруты воркера")).toBeInTheDocument();
    expect(screen.getByText("/echo")).toBeInTheDocument();
    expect(screen.getByText("Ответа пока нет")).toBeInTheDocument();
  });

  it("события: лента со ссылкой на задачу", async () => {
    renderTab("events", none);

    expect(await screen.findByText("echo.done")).toBeInTheDocument();
    expect(screen.getByText("задача 12345678")).toBeInTheDocument();
  });

  it("журнал: записи с узла — только с правом", () => {
    const { unmount } = renderTab("logs", none);

    expect(screen.queryByText("Журнал с узла:")).toBeNull();
    unmount();

    renderTab("logs", { ...none, canLogs: true });
    expect(screen.getByText("Журнал с узла:")).toBeInTheDocument();
  });
});
