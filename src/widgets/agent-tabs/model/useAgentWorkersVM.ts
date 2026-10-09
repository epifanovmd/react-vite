import {
  agentWorkers,
  IAgentsStore,
  isAgentLive,
  useAgentLiveMetrics,
  workerMetrics,
} from "@entities/agent";
import { useWorkerActions } from "@features/manage-agent";
import type { AgentDto, IAgentWorkerDto } from "@shared/api/gen/main/model";

/** Строка таблицы воркеров: воркер и его последний ответ `GET /metrics`. */
export interface IWorkerRow {
  worker: IAgentWorkerDto;
  /** Нет в точке — воркер не ответил или метрик не отдаёт. */
  metrics: unknown;
  /**
   * Отложенная замена (`restart` | `update`): из статуса агента или из
   * ответа на действие, пока статус её ещё не показал; нет — `null`.
   */
  pending: string | null;
}

/** Действия над воркером в строке таблицы. */
export interface IWorkerRowAccess {
  canRestart: boolean;
  /** Версия выпуска, до которой можно обновить; нельзя — `null`. */
  updateTo: string | null;
  /** Воркер занят или замена ждёт его — можно заменить сразу. */
  canReplaceNow: boolean;
}

/**
 * Воркеры агента: состояние, самочувствие, отложенная замена и метрики из
 * последней точки; действия — встроенные действия агента (кроме встроенного
 * воркера: он часть агента). `canManage` — право на действия (его считает
 * страница).
 */
export const useAgentWorkersVM = (agent: AgentDto, canManage: boolean) => {
  const store = IAgentsStore.useInstance();
  const actions = useWorkerActions();
  const live = useAgentLiveMetrics(agent.id);
  const latest =
    live.latest && live.latest.at >= (agent.metrics?.at ?? 0)
      ? live.latest
      : agent.metrics;

  const pendingOf = (worker: IAgentWorkerDto): string | null =>
    worker.pending ?? store.deferredOf(agent.id, worker.name)?.pending ?? null;

  const accessOf = (worker: IAgentWorkerDto): IWorkerRowAccess => {
    const can = canManage && isAgentLive(agent) && !worker.builtin;
    const candidate = store.workerCandidate(agent.id, worker.name);

    return {
      canRestart: can,
      updateTo: can && worker.release && candidate ? candidate.target : null,
      canReplaceNow: can && (!!pendingOf(worker) || !!worker.health?.busy),
    };
  };

  return {
    agent,
    rows: agentWorkers(agent).map((worker): IWorkerRow => ({
      worker,
      metrics: workerMetrics(latest, worker.name),
      pending: pendingOf(worker),
    })),
    actions,
    accessOf,
    /** Версия выпуска для воркера; неизвестна — `null`. */
    updateTargetOf: (worker: IAgentWorkerDto) =>
      store.workerCandidate(agent.id, worker.name)?.target ?? null,
    /** Меняется вместе с правом — колонки таблицы пересобираются по нему. */
    accessKey: String(canManage),
  };
};

export type AgentWorkersVM = ReturnType<typeof useAgentWorkersVM>;
