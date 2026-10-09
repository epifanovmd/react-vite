import type { JobRunDto } from "@shared/api/gen/main/model";
import { TooltipProvider } from "@shared/ui";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { JobList } from "../JobList";

const job = (patch: Partial<JobRunDto>): JobRunDto => ({
  id: "j-1",
  queue: "demo.echo",
  status: "running",
  title: "Проверка агента: demo.echo",
  progress: 0.4,
  progressText: "шаг 2 из 5",
  logTail: [],
  result: null,
  error: null,
  ownerId: "u-1",
  scopeType: null,
  scopeId: null,
  attempt: 0,
  cancelRequested: false,
  agentId: "a1b2c3d4e5f6",
  worker: "echo",
  jobType: "echo.long",
  outputs: null,
  deadlineAt: null,
  startedAt: null,
  finishedAt: null,
  createdAt: "2026-10-09T10:00:00.000Z",
  ...patch,
});

const renderList = (jobs: JobRunDto[], onCancel = vi.fn()) =>
  render(
    <TooltipProvider>
      <JobList
        jobs={jobs}
        isLoading={false}
        busyId={null}
        agentOf={() => null}
        onCancel={onCancel}
      />
    </TooltipProvider>,
  );

describe("JobList", () => {
  it("идёт: ход, исполнитель и отмена; досрочного завершения нет", () => {
    const onCancel = vi.fn();

    renderList([job({})], onCancel);

    expect(screen.getByText("шаг 2 из 5")).toBeInTheDocument();
    expect(screen.getByText("40%")).toBeInTheDocument();
    expect(
      screen.getByText("echo.long · воркер echo · агент a1b2c3d4"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Завершить досрочно")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Отменить" }));
    expect(onCancel).toHaveBeenCalledWith("j-1");
  });

  it("готово: итог и ссылка на скачивание файла итога; ошибка — с кодом", () => {
    renderList([
      job({
        id: "j-1",
        status: "completed",
        result: { text: "HI", output: "result" },
        outputs: [
          {
            name: "result",
            url: "https://s3.example.com/jobs/j-1/echo.txt?sig=1",
            size: 2048,
            expiresAt: "2026-10-09T11:00:00.000Z",
          },
        ],
      }),
      job({
        id: "j-2",
        status: "failed",
        error: { code: "JOB_TIMEOUT", message: "Срок истёк" },
      }),
    ]);

    expect(screen.getByText('{"text":"HI","output":"result"}')).toBeVisible();

    const link = screen.getByRole("link", { name: /result/ });

    expect(link).toHaveAttribute(
      "href",
      "https://s3.example.com/jobs/j-1/echo.txt?sig=1",
    );
    expect(link).toHaveTextContent("(2 КБ)");
    expect(link).toHaveTextContent("скачать");
    expect(screen.getByText("JOB_TIMEOUT: Срок истёк")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Отменить" })).toBeNull();
  });

  it("пусто — подпись под фильтр", () => {
    render(
      <JobList
        jobs={[]}
        isLoading={false}
        busyId={null}
        agentOf={() => null}
        onCancel={vi.fn()}
        emptyText="Нет задач этого агента."
      />,
    );

    expect(screen.getByText("Нет задач этого агента.")).toBeInTheDocument();
  });
});
