import type { IWorkerQueueStatusDto } from "@shared/api/gen/main/model";
import { formatter } from "@shared/lib/utils";
import { Badge, Skeleton } from "@shared/ui";
import { FC } from "react";

interface WorkerStatusProps {
  queues: IWorkerQueueStatusDto[];
  isLoading: boolean;
}

/** Внешние очереди и воркеры, приславшие heartbeat. */
export const WorkerStatus: FC<WorkerStatusProps> = ({ queues, isLoading }) => {
  if (isLoading && queues.length === 0)
    return <Skeleton className="h-12 w-full" />;
  if (queues.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Внешних очередей нет.</p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {queues.map(queue => (
        <li key={queue.queue} className="flex flex-col gap-1">
          <p className="flex items-center gap-2 text-sm font-medium text-foreground">
            <span className="font-mono">{queue.queue}</span>
            <Badge variant={queue.online ? "success" : "muted"} dot>
              {queue.online ? "онлайн" : "офлайн"}
            </Badge>
          </p>
          {queue.workers.map(worker => (
            <p key={worker.name} className="text-xs text-muted-foreground">
              {worker.name} · heartbeat{" "}
              {formatter.date.formatDiff(worker.lastSeenAt)}
            </p>
          ))}
        </li>
      ))}
    </ul>
  );
};
