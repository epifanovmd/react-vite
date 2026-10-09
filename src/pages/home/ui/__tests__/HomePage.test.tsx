import { agentModule } from "@entities/agent";
import { nodeModule } from "@entities/node";
import { IUserStore } from "@entities/user";
import { IMainApi } from "@shared/api";
import { createFakeAccess } from "@shared/lib/access/testing";
import { iocContainer } from "@shared/lib/di";
import { ISocketTransport } from "@shared/lib/socket";
import { createFakeSocket } from "@shared/lib/socket/testing";
import { TooltipProvider } from "@shared/ui";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { HomePage } from "../HomePage";

vi.mock("@tanstack/react-router", async importOriginal => ({
  ...(await importOriginal<object>()),
  Link: ({ children }: { children: ReactNode }) => <a href="#">{children}</a>,
  Navigate: ({ to }: { to: string }) => <p>переход на {to}</p>,
}));

const item = (
  id: string,
  status: string,
  statusMessage: string | null = null,
) => ({
  id,
  name: `node-${id}`,
  host: null,
  status,
  statusMessage,
});

const api = {
  getNodes: vi.fn(async () => ({
    data: {
      items: [
        item("1", "online"),
        item("2", "online"),
        item("3", "offline"),
        item("4", "error", "Установка не удалась"),
      ],
      total: 4,
    },
  })),
  getAgentAlerts: vi.fn(async () => ({
    data: [
      {
        key: "offline",
        type: "offline",
        agentId: "a-9",
        agentName: "edge-9",
        message: "Агент не на связи",
        since: 1,
      },
    ],
  })),
};
let permissions: string[];

beforeEach(() => {
  permissions = ["node:view:own"];
  iocContainer.bind(IMainApi.Tid).toConstantValue(api);
  iocContainer.load(nodeModule, agentModule);
  iocContainer
    .bind(IUserStore.Tid)
    .toConstantValue({ ...createFakeAccess({ permissions }), isReady: true });
  iocContainer.bind(ISocketTransport.Tid).toConstantValue(createFakeSocket());
});

afterEach(() => {
  iocContainer.unbind(IMainApi.Tid);
  iocContainer.unload(nodeModule, agentModule);
  iocContainer.unbind(IUserStore.Tid);
  iocContainer.unbind(ISocketTransport.Tid);
  vi.clearAllMocks();
});

const renderPage = () =>
  render(
    <TooltipProvider>
      <HomePage />
    </TooltipProvider>,
  );

describe("HomePage", () => {
  it("сводка по узлам и узлы, которым нужно внимание", async () => {
    renderPage();

    expect(await screen.findByText("Установка не удалась")).toBeInTheDocument();
    expect(
      screen.getByText("Всего").parentElement?.parentElement,
    ).toHaveTextContent("4");
    expect(
      screen.getByText("На связи", { selector: "p,span,div" }),
    ).toBeInTheDocument();
    expect(screen.getByText("node-3")).toBeInTheDocument();
    expect(screen.queryByText("node-1")).toBeNull();
    // Проблемы агентов — только с правом на агентов.
    expect(api.getAgentAlerts).not.toHaveBeenCalled();
  });

  it("с правом на агентов — их проблемы", async () => {
    permissions.push("agent:view");
    renderPage();

    expect(await screen.findByText("Проблемы · 1")).toBeInTheDocument();
    expect(screen.getByText("edge-9")).toBeInTheDocument();
    expect(screen.getByText("нет связи")).toBeInTheDocument();
  });

  it("без права на узлы — в профиль", () => {
    permissions.length = 0;
    renderPage();

    expect(screen.getByText("переход на /profile")).toBeInTheDocument();
    expect(api.getNodes).not.toHaveBeenCalled();
  });
});
