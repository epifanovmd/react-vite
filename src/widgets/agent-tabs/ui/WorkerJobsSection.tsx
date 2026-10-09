import { formatJson } from "@entities/agent";
import type { IAgentManifestJobDto } from "@shared/api/gen/main/model";
import { Collapse } from "@shared/ui";
import { FC } from "react";

interface WorkerJobsSectionProps {
  jobs: IAgentManifestJobDto[];
}

const SUBTITLE_CLASS =
  "text-xs font-medium uppercase tracking-wide text-muted-foreground";

/** Типы задач воркера из манифеста (`manifest.jobs`): тип, описание, схема данных. */
export const WorkerJobsSection: FC<WorkerJobsSectionProps> = ({ jobs }) => (
  <section className="flex flex-col gap-1.5">
    <h4 className={SUBTITLE_CLASS}>Задачи · {jobs.length}</h4>
    {jobs.length === 0 ? (
      <p className="text-xs text-muted-foreground">нет</p>
    ) : (
      <ul className="flex flex-col gap-1">
        {jobs.map(job => (
          <li key={job.type}>
            <span className="font-mono text-xs">{job.type}</span>
            {job.description && (
              <span className="block text-xs text-muted-foreground">
                {job.description}
              </span>
            )}
            {job.schema && Object.keys(job.schema).length > 0 && (
              <Collapse size="sm">
                <Collapse.Trigger>Схема данных</Collapse.Trigger>
                <Collapse.Content>
                  <pre className="max-h-48 overflow-auto rounded bg-muted p-2 text-xs">
                    {formatJson(job.schema)}
                  </pre>
                </Collapse.Content>
              </Collapse>
            )}
          </li>
        ))}
      </ul>
    )}
  </section>
);
