import {
  AGENT_PERMISSIONS,
  IAgentsStore,
  useAgentsRealtime,
} from "@entities/agent";
import { IJobStore, JOB_PERMISSIONS } from "@entities/job";
import { IUserStore } from "@entities/user";
import { notifyApiError } from "@shared/lib/http";
import { INotificationService } from "@shared/lib/notifications";
import { useEffect, useState } from "react";

/** Исполнитель внешней задачи: ссылка на агента. */
export interface IJobAgentRef {
  id: string;
  name: string;
}

/**
 * Свои задачи: список с обновлениями по сокету, отмена, исполнитель
 * (агент и воркер). `agentId` — показать только задачи этого агента.
 */
export const useJobsVM = (agentId: string | null = null) => {
  const toast = INotificationService.useInstance();
  const jobs = IJobStore.useInstance();
  const agents = IAgentsStore.useInstance();
  const userStore = IUserStore.useInstance();
  const canViewAgents = userStore.can(AGENT_PERMISSIONS.VIEW);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    jobs.load().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Имена исполнителей — из списка агентов (только с правом на агентов).
  useEffect(() => {
    if (canViewAgents) void agents.load();
  }, [agents, canViewAgents]);
  useAgentsRealtime(canViewAgents);

  const cancel = async (id: string) => {
    setBusyId(id);

    const { error } = await jobs.cancel(id);

    setBusyId(null);
    notifyApiError(toast, error);
  };

  /** Агент-исполнитель; `null` — нет агента или нет права. */
  const agentOf = (id: string | null): IJobAgentRef | null => {
    const agent = id && canViewAgents ? agents.byId(id) : undefined;

    return agent ? { id: agent.id, name: agent.name } : null;
  };

  return {
    jobs: agentId
      ? jobs.jobs.filter(job => job.agentId === agentId)
      : jobs.jobs,
    isLoading: jobs.isLoading,
    error: jobs.error,
    busyId,
    cancel,
    agentOf,
    /** Фильтр по агенту: имя (если видно) или id. */
    agentFilter: agentId
      ? { id: agentId, name: agentOf(agentId)?.name ?? agentId }
      : null,
    canRunDemo: userStore.can(JOB_PERMISSIONS.DEMO),
  };
};
