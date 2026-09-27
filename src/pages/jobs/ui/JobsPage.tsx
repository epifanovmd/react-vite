import { RunDemoJobForm } from "@features/run-demo-job";
import { Card, PageHeader, PageLayout } from "@shared/ui";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import { useJobsVM } from "../model/useJobsVM";
import { JobList } from "./JobList";
import { WorkerStatus } from "./WorkerStatus";

const header = (
  <PageHeader
    title="Фоновые задачи"
    subtitle="Прогресс обновляется в реальном времени"
  />
);

export const JobsPage: FC = observer(() => {
  const { jobs, isLoading, workers, isWorkersLoading, cancellingId, cancel } =
    useJobsVM();

  return (
    <PageLayout header={header}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <Card title="Мои задачи" description="Последние 50 задач">
          <JobList
            jobs={jobs}
            isLoading={isLoading}
            cancellingId={cancellingId}
            onCancel={cancel}
          />
        </Card>
        <div className="flex flex-col gap-4">
          <Card
            title="Демо: echo"
            description="Очередь demo.echo, внешний воркер"
          >
            <RunDemoJobForm />
          </Card>
          <Card title="Воркеры">
            <WorkerStatus queues={workers} isLoading={isWorkersLoading} />
          </Card>
        </div>
      </div>
    </PageLayout>
  );
});
