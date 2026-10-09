import { formatSize } from "@entities/agent";
import { Alert, Badge, Button, Collapse, Empty, Tooltip } from "@shared/ui";
import { Download } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import type { WorkerFetchSession } from "../model/worker-fetch-session";

interface WorkerFetchResponseProps {
  session: WorkerFetchSession;
  onDownload: () => void;
}

const statusVariant = (status: number) => {
  if (status >= 500) return "destructive" as const;
  if (status >= 400) return "warning" as const;
  if (status >= 300) return "info" as const;

  return "success" as const;
};

const STATE_TEXT: Record<string, string> = {
  sending: "ждём ответа…",
  streaming: "тело приходит…",
  done: "готово",
  cancelled: "прервано",
  failed: "ошибка",
};

/**
 * Ответ воркера: его статус (`X-Agent-Worker-Status`), заголовки и тело по
 * мере прихода; двоичное — размер и файл. Ошибка API (заголовка нет) —
 * отдельно: код и текст сервера.
 */
export const WorkerFetchResponse: FC<WorkerFetchResponseProps> = observer(
  ({ session, onDownload }) => {
    if (session.state === "idle") {
      return (
        <Empty
          size="sm"
          title="Ответа пока нет"
          description="Выберите маршрут воркера и отправьте запрос"
        />
      );
    }

    const { head } = session;
    const duration = session.durationAt(session.finishedAt ?? Date.now());
    const headers = Object.entries(head?.headers ?? {}).sort(([a], [b]) =>
      a.localeCompare(b),
    );

    return (
      <div className="flex flex-col gap-3">
        <p className="flex flex-wrap items-center gap-2 text-sm">
          {head && head.workerStatus !== null && (
            <Tooltip content="Статус ответа воркера (X-Agent-Worker-Status)">
              <Badge
                variant={statusVariant(head.workerStatus)}
                className="font-mono"
              >
                воркер {head.workerStatus}
              </Badge>
            </Tooltip>
          )}
          {head && head.workerStatus === null && (
            <Tooltip content="Ответ сервера, а не воркера: запрос до воркера не дошёл">
              <Badge variant="destructive" className="font-mono">
                API {head.status}
              </Badge>
            </Tooltip>
          )}
          <span className="font-mono text-muted-foreground">
            {session.request}
          </span>
          <span className="text-muted-foreground">
            {[
              STATE_TEXT[session.state],
              head && formatSize(session.size),
              session.finishedAt && duration !== null && `${duration} мс`,
            ]
              .filter(Boolean)
              .join(" · ")}
          </span>
        </p>
        {session.apiError && (
          <Alert variant="destructive" title="Ошибка API — воркер не ответил">
            <span className="flex flex-col gap-1">
              {session.apiError.code && (
                <span className="font-mono text-xs">
                  {session.apiError.code} · HTTP {session.apiError.status}
                </span>
              )}
              {session.apiError.message}
            </span>
          </Alert>
        )}
        {session.error && session.state === "failed" && (
          <Alert variant="destructive" title="Запрос не выполнен">
            {session.error}
          </Alert>
        )}
        {headers.length > 0 && (
          <Collapse size="sm">
            <Collapse.Trigger>Заголовки ({headers.length})</Collapse.Trigger>
            <Collapse.Content>
              <pre className="max-h-48 overflow-auto rounded bg-muted p-2 text-xs">
                {headers.map(([name, value]) => `${name}: ${value}`).join("\n")}
              </pre>
            </Collapse.Content>
          </Collapse>
        )}
        {head &&
          !session.isApiError &&
          (session.text === null ? (
            <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-3 text-sm">
              <span>
                Двоичное тело: {formatSize(session.size)}
                {head.headers["content-type"] &&
                  ` · ${head.headers["content-type"]}`}
              </span>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Download size={15} />}
                disabled={session.isRunning}
                onClick={onDownload}
              >
                Скачать
              </Button>
            </div>
          ) : (
            <>
              <pre className="max-h-[28rem] min-h-24 overflow-auto whitespace-pre-wrap break-all rounded-lg bg-muted p-3 text-xs">
                {session.text || (session.isRunning ? "" : "Тело пустое")}
              </pre>
              {session.truncated && (
                <p className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  Показано начало ответа.
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<Download size={15} />}
                    disabled={session.isRunning}
                    onClick={onDownload}
                  >
                    Скачать целиком
                  </Button>
                </p>
              )}
            </>
          ))}
      </div>
    );
  },
);
