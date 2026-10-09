import type { INodeJobDto, JobRunDto } from "@shared/api/gen/main/model";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { ProvisionJobBanner } from "../ProvisionJobBanner";

vi.mock("@tanstack/react-router", async importOriginal => ({
  ...(await importOriginal<object>()),
  Link: ({ children }: { children: ReactNode }) => <a href="#">{children}</a>,
}));

const job = (patch: Partial<INodeJobDto> = {}): INodeJobDto => ({
  id: "j-1",
  kind: "install",
  status: "running",
  progress: 0.4,
  progressText: "Скачивание установщика",
  error: null,
  createdAt: "2026-10-01T10:00:00.000Z",
  finishedAt: null,
  ...patch,
});

const run = (patch: Partial<JobRunDto> = {}) =>
  ({ id: "j-1", logTail: ["шаг 1", "ошибка curl"], ...patch }) as JobRunDto;

describe("ProvisionJobBanner", () => {
  it("идёт установка — прогресс и шаг", () => {
    render(
      <ProvisionJobBanner
        job={job()}
        run={null}
        nodeStatus="provisioning"
        agentOnline={false}
      />,
    );

    expect(screen.getByText("Установка агента")).toBeInTheDocument();
    expect(screen.getByText("Скачивание установщика")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "40",
    );
  });

  it("провал — ошибка и хвост журнала задачи", () => {
    render(
      <ProvisionJobBanner
        job={job({
          status: "failed",
          error: { message: "нет доступа", code: "SSH" },
        })}
        run={run({ status: "failed" })}
        nodeStatus="error"
        agentOnline={false}
      />,
    );

    expect(screen.getByText("Установка агента не удалась")).toBeInTheDocument();
    expect(screen.getByText("нет доступа")).toBeInTheDocument();
    expect(screen.getByText(/ошибка curl/)).toBeInTheDocument();
  });

  it("провал удаления виден и при живом агенте", () => {
    render(
      <ProvisionJobBanner
        job={job({ kind: "uninstall", status: "cancelled" })}
        run={null}
        nodeStatus="online"
        agentOnline
      />,
    );

    expect(screen.getByText("Удаление агента не удалось")).toBeInTheDocument();
    expect(screen.getByText("Задача отменена")).toBeInTheDocument();
  });

  it("установлен, но агент ещё не на связи — ждём", () => {
    const { rerender, container } = render(
      <ProvisionJobBanner
        job={job({ status: "completed" })}
        run={null}
        nodeStatus="created"
        agentOnline={false}
      />,
    );

    expect(screen.getByText(/ждём выхода агента на связь/)).toBeInTheDocument();

    rerender(
      <ProvisionJobBanner
        job={job({ status: "completed" })}
        run={null}
        nodeStatus="online"
        agentOnline
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("задачи нет — ничего", () => {
    const { container } = render(
      <ProvisionJobBanner
        job={null}
        run={null}
        nodeStatus="created"
        agentOnline={false}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
