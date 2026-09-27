import { IJobStore } from "@entities/job";
import { IMainApi } from "@shared/api";
import type { IWorkerQueueStatusDto } from "@shared/api/gen/main/model";
import { usePolling } from "@shared/lib/holders";
import { notifyApiError } from "@shared/lib/http";
import { INotificationService } from "@shared/lib/notifications";
import { useEffect, useState } from "react";

/** Как часто обновлять статус воркеров, мс. */
const WORKERS_POLL_INTERVAL = 15_000;

export const useJobsVM = () => {
  const api = IMainApi.useInstance();
  const toast = INotificationService.useInstance();
  const jobs = IJobStore.useInstance();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const workers = usePolling<IWorkerQueueStatusDto[]>({
    queryFn: () => api.status(),
    interval: WORKERS_POLL_INTERVAL,
    autoStart: true,
  });

  useEffect(() => {
    jobs.load().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cancel = async (id: string) => {
    setCancellingId(id);

    const { error } = await jobs.cancel(id);

    setCancellingId(null);
    notifyApiError(toast, error);
  };

  return {
    jobs: jobs.jobs,
    isLoading: jobs.isLoading,
    error: jobs.error,
    workers: workers.data ?? [],
    isWorkersLoading: workers.isLoading,
    cancellingId,
    cancel,
  };
};
