import {
  isJobActive,
  jobAttemptText,
  jobErrorDetails,
  jobExecutorText,
  jobOutputFiles,
  jobResultText,
  JobStatusBadge,
} from "@entities/job";
import type { JobRunDto } from "@shared/api/gen/main/model";
import { formatBytes, formatter } from "@shared/lib/utils";
import { Button, Collapse, Empty, Progress, Skeleton } from "@shared/ui";
import { Link } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { FC } from "react";

import type { IJobAgentRef } from "../model/useJobsVM";

interface JobListProps {
  jobs: JobRunDto[];
  isLoading: boolean;
  /** Задача, по которой идёт отмена. */
  busyId: string | null;
  /** Агент-исполнитель; `null` — нет агента или нет права. */
  agentOf: (id: string | null) => IJobAgentRef | null;
  onCancel: (id: string) => void;
  /** Пустой список: подпись под фильтр. */
  emptyText?: string;
}

interface JobRowProps {
  job: JobRunDto;
  busy: boolean;
  agent: IJobAgentRef | null;
  onCancel: (id: string) => void;
}

/** Исполнитель внешней задачи: тип задачи, воркер и агент (ссылкой, если виден). */
const JobExecutor: FC<{ job: JobRunDto; agent: IJobAgentRef | null }> = ({
  job,
  agent,
}) => {
  const executor = jobExecutorText(job);

  if (!executor && !job.agentId) return null;

  return (
    <p className="truncate text-xs text-muted-foreground">
      {executor}
      {executor && job.agentId && " · "}
      {agent ? (
        <>
          {"агент "}
          <Link
            to="/agents/$agentId"
            params={{ agentId: agent.id }}
            className="hover:underline"
          >
            {agent.name}
          </Link>
        </>
      ) : (
        job.agentId && `агент ${job.agentId.slice(0, 8)}`
      )}
    </p>
  );
};

const JobRow: FC<JobRowProps> = ({ job, busy, agent, onCancel }) => {
  const active = isJobActive(job);
  const error = jobErrorDetails(job);
  const result = jobResultText(job);
  const files = jobOutputFiles(job);
  const meta = [
    job.queue,
    formatter.date.format(job.createdAt),
    jobAttemptText(job),
    active && job.deadlineAt && `срок ${formatter.date.format(job.deadlineAt)}`,
  ].filter(Boolean);

  return (
    <li className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 truncate text-sm font-medium text-foreground">
            {job.title}
            <JobStatusBadge status={job.status} />
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {meta.join(" · ")}
          </p>
          <JobExecutor job={job} agent={agent} />
        </div>
        {active && (
          <Button
            size="sm"
            variant="outline"
            loading={busy}
            disabled={job.cancelRequested}
            onClick={() => onCancel(job.id)}
          >
            {job.cancelRequested ? "Отменяется…" : "Отменить"}
          </Button>
        )}
      </div>
      {active && (
        <div className="flex items-center gap-3">
          <Progress
            className="flex-1"
            value={job.progress}
            indeterminate={job.status === "queued"}
          />
          <span className="w-10 text-right text-xs tabular-nums text-muted-foreground">
            {Math.round(job.progress * 100)}%
          </span>
        </div>
      )}
      {active && job.progressText && (
        <p className="text-xs text-muted-foreground">{job.progressText}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
      {result && (
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Итог</span>
          <code className="truncate rounded bg-muted px-2 py-1 text-xs">
            {result}
          </code>
        </div>
      )}
      {files.length > 0 && (
        <p className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          Файлы итога:
          {files.map(file => (
            <a
              key={file.name}
              href={file.url}
              download
              rel="noopener noreferrer"
              title={`Скачать ${file.name}`}
              className="inline-flex items-center gap-1 font-mono text-foreground hover:underline"
            >
              <Download size={12} />
              {file.name}
              {file.size != null && (
                <span className="text-muted-foreground">
                  ({formatBytes(file.size)})
                </span>
              )}
              <span className="font-sans text-primary">скачать</span>
            </a>
          ))}
        </p>
      )}
      {job.logTail.length > 0 && (
        <Collapse size="sm">
          <Collapse.Trigger>Журнал ({job.logTail.length})</Collapse.Trigger>
          <Collapse.Content innerClassName="pb-1">
            <pre className="max-h-48 overflow-auto rounded bg-muted px-2 py-1 text-xs leading-relaxed">
              {job.logTail.join("\n")}
            </pre>
          </Collapse.Content>
        </Collapse>
      )}
    </li>
  );
};

export const JobList: FC<JobListProps> = ({
  jobs,
  isLoading,
  busyId,
  agentOf,
  onCancel,
  emptyText,
}) => {
  if (isLoading && jobs.length === 0)
    return <Skeleton className="h-24 w-full" />;
  if (jobs.length === 0) {
    return (
      <Empty
        title="Задач пока нет"
        description={
          emptyText ??
          "Запустите демо-задачу, чтобы увидеть прогресс в реальном времени."
        }
      />
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-border">
      {jobs.map(job => (
        <JobRow
          key={job.id}
          job={job}
          busy={busyId === job.id}
          agent={agentOf(job.agentId)}
          onCancel={onCancel}
        />
      ))}
    </ul>
  );
};
