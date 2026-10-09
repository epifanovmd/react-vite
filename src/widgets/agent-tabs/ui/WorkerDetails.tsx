import { formatJson } from "@entities/agent";
import { Badge, Collapse } from "@shared/ui";
import { FC } from "react";

import type { IWorkerRow } from "../model/useAgentWorkersVM";
import { WorkerJobsSection } from "./WorkerJobsSection";
import { WorkerMetricsSummary } from "./WorkerMetricsSummary";

interface WorkerDetailsProps {
  row: IWorkerRow;
}

const SUBTITLE_CLASS =
  "text-xs font-medium uppercase tracking-wide text-muted-foreground";

/**
 * Раскрытая строка воркера: манифест (описание, маршруты, события, ключи
 * настроек, типы задач), сведения из `/health` и метрики.
 */
export const WorkerDetails: FC<WorkerDetailsProps> = ({ row }) => {
  const { worker, metrics } = row;
  const manifest = worker.manifest;
  const info = worker.health?.info;

  return (
    <div className="flex flex-col gap-4 px-4 py-3 text-sm">
      {worker.builtin ? (
        <p className="text-muted-foreground">
          Встроенный воркер собирает метрики узла — они на вкладке «Обзор».
        </p>
      ) : !manifest ? (
        <p className="text-muted-foreground">
          Манифеста нет: воркер ещё не проверен или ответил на `GET /manifest`
          не так, как нужно.
        </p>
      ) : (
        <>
          {manifest.description && <p>{manifest.description}</p>}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
            <section className="flex flex-col gap-1.5">
              <h4 className={SUBTITLE_CLASS}>
                Маршруты · {manifest.routes.length}
              </h4>
              {manifest.routes.length === 0 ? (
                <p className="text-xs text-muted-foreground">нет</p>
              ) : (
                <ul className="flex flex-col gap-1">
                  {manifest.routes.map(route => (
                    <li key={`${route.method} ${route.path}`}>
                      <span className="font-mono text-xs">
                        {route.method.toUpperCase()} {route.path}
                      </span>
                      {route.description && (
                        <span className="block text-xs text-muted-foreground">
                          {route.description}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section className="flex flex-col gap-1.5">
              <h4 className={SUBTITLE_CLASS}>
                События · {manifest.events.length}
              </h4>
              {manifest.events.length === 0 ? (
                <p className="text-xs text-muted-foreground">нет</p>
              ) : (
                <ul className="flex flex-col gap-1">
                  {manifest.events.map(event => (
                    <li key={event.type}>
                      <span className="font-mono text-xs">{event.type}</span>
                      {event.description && (
                        <span className="block text-xs text-muted-foreground">
                          {event.description}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section className="flex flex-col gap-1.5">
              <h4 className={SUBTITLE_CLASS}>
                Ключи настроек · {manifest.configs.length}
              </h4>
              {manifest.configs.length === 0 ? (
                <p className="text-xs text-muted-foreground">нет</p>
              ) : (
                <ul className="flex flex-col gap-1">
                  {manifest.configs.map(config => {
                    const report = worker.configs?.[config.key];

                    return (
                      <li key={config.key}>
                        <span className="flex flex-wrap items-center gap-1.5">
                          <span className="font-mono text-xs">
                            {config.key}
                          </span>
                          {report && (
                            <Badge
                              variant={
                                report.ok === undefined
                                  ? "info"
                                  : report.ok
                                    ? "success"
                                    : "destructive"
                              }
                            >
                              v{report.version}
                              {report.ok === undefined
                                ? " · применяется"
                                : report.ok
                                  ? ""
                                  : " · ошибка"}
                            </Badge>
                          )}
                        </span>
                        {config.description && (
                          <span className="block text-xs text-muted-foreground">
                            {config.description}
                          </span>
                        )}
                        {report?.error && (
                          <span className="block text-xs text-destructive">
                            {report.error.message}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
            <WorkerJobsSection jobs={manifest.jobs} />
          </div>
        </>
      )}
      <WorkerMetricsSummary metrics={metrics} />
      {info && Object.keys(info).length > 0 && (
        <Collapse size="sm">
          <Collapse.Trigger>Сведения воркера (health.info)</Collapse.Trigger>
          <Collapse.Content>
            <pre className="max-h-48 overflow-auto rounded bg-muted p-2 text-xs">
              {formatJson(info)}
            </pre>
          </Collapse.Content>
        </Collapse>
      )}
    </div>
  );
};
