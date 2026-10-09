import type {
  ENodeStatus,
  INodeJobDto,
  JobRunDto,
} from "@shared/api/gen/main/model";
import { Alert, Progress } from "@shared/ui";
import { Link } from "@tanstack/react-router";
import { FC } from "react";

interface ProvisionJobBannerProps {
  /** Последняя задача узла из карточки узла. */
  job: INodeJobDto | null;
  /** Та же задача целиком (с журналом), если уже загружена. */
  run: JobRunDto | null;
  nodeStatus: ENodeStatus;
  /** Агент уже на связи: ждать нечего. */
  agentOnline: boolean;
}

/** Строк журнала задачи в сообщении об ошибке. */
const LOG_TAIL_LINES = 12;

const TITLE = {
  install: {
    active: "Установка агента",
    failed: "Установка агента не удалась",
  },
  uninstall: {
    active: "Удаление агента",
    failed: "Удаление агента не удалось",
  },
} as const;

/** Ход установки или удаления агента на карточке узла (обновления — по сокету). */
export const ProvisionJobBanner: FC<ProvisionJobBannerProps> = ({
  job,
  run,
  nodeStatus,
  agentOnline,
}) => {
  if (!job) return null;

  // Полная задача свежее, когда она уже пришла событием.
  const status = run?.status ?? job.status;
  const progress = run?.progress ?? job.progress;
  const progressText = run?.progressText ?? job.progressText;
  const error = run?.error ?? job.error;
  const title = TITLE[job.kind];
  const jobsLink = (
    <Link to="/jobs" className="underline">
      все задачи
    </Link>
  );

  if (status === "queued" || status === "running") {
    return (
      <Alert variant="info" title={title.active}>
        <div className="flex flex-col gap-2">
          <Progress
            value={progress}
            indeterminate={status === "queued"}
            aria-label="Ход задачи"
          />
          <span className="flex flex-wrap gap-2 text-sm">
            <span>{progressText ?? "В очереди"}</span>
            {jobsLink}
          </span>
        </div>
      </Alert>
    );
  }

  if (status === "failed" || status === "cancelled") {
    // Провал удаления при живом агенте статус узла не меняет — тоже показываем.
    if (job.kind === "install" && nodeStatus !== "error") return null;

    const tail = run?.logTail.slice(-LOG_TAIL_LINES) ?? [];

    return (
      <Alert variant="destructive" title={title.failed}>
        <div className="flex flex-col gap-2 text-sm">
          <span>{error?.message ?? "Задача отменена"}</span>
          {tail.length > 0 && (
            <pre className="max-h-48 overflow-auto rounded bg-muted p-2 text-xs text-foreground">
              {tail.join("\n")}
            </pre>
          )}
          <span>{jobsLink}</span>
        </div>
      </Alert>
    );
  }

  if (
    status === "completed" &&
    job.kind === "install" &&
    !agentOnline &&
    nodeStatus !== "online"
  ) {
    return (
      <Alert variant="info" title="Агент установлен">
        Служба агента запущена, ждём выхода агента на связь.
      </Alert>
    );
  }

  return null;
};
