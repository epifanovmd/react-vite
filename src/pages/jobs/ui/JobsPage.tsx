import { RunDemoJobForm } from "@features/run-demo-job";
import { cn } from "@shared/lib/utils";
import { Card, Chip, PageHeader, PageLayout } from "@shared/ui";
import { getRouteApi } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import { useJobsVM } from "../model/useJobsVM";
import { JobList } from "./JobList";

const jobsRoute = getRouteApi("/_app/jobs");

const header = (
  <PageHeader
    title="Фоновые задачи"
    subtitle="Ход задач обновляется в реальном времени"
  />
);

export const JobsPage: FC = observer(() => {
  const { agent: agentId = null } = jobsRoute.useSearch();
  const navigate = jobsRoute.useNavigate();
  const { jobs, isLoading, busyId, cancel, agentOf, agentFilter, canRunDemo } =
    useJobsVM(agentId);

  return (
    <PageLayout header={header}>
      <div
        className={cn(
          "grid grid-cols-1 gap-4",
          canRunDemo && "lg:grid-cols-[1fr_340px]",
        )}
      >
        <Card
          title="Мои задачи"
          description="Последние 50 задач"
          extra={
            agentFilter && (
              <Chip
                onRemove={() => void navigate({ search: {} })}
                removeLabel="Показать задачи всех агентов"
              >
                агент {agentFilter.name}
              </Chip>
            )
          }
        >
          <JobList
            jobs={jobs}
            isLoading={isLoading}
            busyId={busyId}
            agentOf={agentOf}
            onCancel={cancel}
            emptyText={
              agentFilter
                ? "Среди последних задач нет задач этого агента."
                : undefined
            }
          />
        </Card>
        {canRunDemo && (
          <Card
            title="Демо: echo"
            description="Очередь demo.echo — выполняет воркер echo агента"
          >
            <RunDemoJobForm />
          </Card>
        )}
      </div>
    </PageLayout>
  );
});
