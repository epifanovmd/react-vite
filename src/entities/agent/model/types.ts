import type {
  AgentAlertDto,
  AgentDto,
  IAgentErrorDto,
  IAgentMetricsPointDto,
  IAgentReleaseDto,
  IAgentUpdateCandidateDto,
  IAgentWorkerUpdateCandidateDto,
} from "@shared/api/gen/main/model";
import { createInjectDecorator } from "@shared/lib/di";
import type { IHolderError } from "@shared/lib/holders";

import type { IAgentLogEntry } from "../lib/log";

export const IAgentsStore = createInjectDecorator<IAgentsStore>("IAgentsStore");

/**
 * Агенты, их активные проблемы и сборки для обновления. Список — запросом,
 * изменения — событиями комнаты `agents` (`useAgentsRealtime`).
 */
export interface IAgentsStore {
  /** На связи — первыми, дальше по имени. */
  readonly agents: AgentDto[];
  readonly isLoading: boolean;
  readonly error: IHolderError | null;
  /** Активные проблемы всех агентов, новые первыми. */
  readonly alerts: AgentAlertDto[];
  /** Сборки и кого можно обновить; нет каталога сборок — `manifest: null`. */
  readonly release: IAgentReleaseDto | null;

  load(): Promise<void>;
  loadAlerts(): Promise<void>;
  loadRelease(): Promise<void>;
  /** Агент по id с сервера: карточка видна, даже если списка ещё нет. */
  fetch(id: string): Promise<{ error: IHolderError | null }>;
  byId(id: string): AgentDto | undefined;
  alertsOf(agentId: string): AgentAlertDto[];
  /** Кандидат на обновление агента до новой версии. */
  updateCandidate(agentId: string): IAgentUpdateCandidateDto | null;
  /** Кандидат на обновление воркера сборкой с сервера. */
  workerCandidate(
    agentId: string,
    worker: string,
  ): IAgentWorkerUpdateCandidateDto | null;
  /** `agent:updated`: добавить или заменить. */
  upsert(agent: AgentDto): void;
  /** `agent:deleted`. */
  remove(id: string): void;
  /** `agent:alert`: активная — добавить, закончившаяся — убрать. */
  applyAlert(alert: AgentAlertDto): void;
  /** Отложенная замена воркера ждёт итога (`agent:action`). */
  trackDeferred(action: IDeferredWorkerAction): void;
  /** Итог отложенной замены пришёл: снять ожидание; не ждали — `undefined`. */
  settleDeferred(actionId: string): IDeferredWorkerAction | undefined;
  /** Замена воркера, которая ждёт окончания его работы. */
  deferredOf(
    agentId: string,
    worker: string,
  ): IDeferredWorkerAction | undefined;
  reset(): void;
}

/** Событие `agent:release`: там, откуда сервер берёт сборки агента, другая версия. */
export interface IAgentReleaseEvent {
  version: string;
  /** Прежняя версия; нет — сборки получены впервые после запуска сервера. */
  previous?: string;
  /** `github:owner/repo` или ссылка на каталог сборок. */
  from: string;
}

/** Отложенная замена воркера: ответ `deferred: true`, итог придёт `agent:action`. */
export interface IDeferredWorkerAction {
  actionId: string;
  agentId: string;
  worker: string;
  /** Что ждёт: `restart` | `update`. */
  pending: string;
}

/** Событие `agent:metrics` (комната агента). */
export interface IAgentMetricsEvent {
  agentId: string;
  point: IAgentMetricsPointDto;
}

/** Событие `agent:log` (комната агента). */
export interface IAgentLogEvent {
  agentId: string;
  entries: IAgentLogEntry[];
}

/** Событие `agent:action` (комната агента): итог встроенного действия. */
export interface IAgentActionEvent {
  id: string;
  agentId: string;
  /** `worker.restart` | `worker.update` | `agent.update` | `agent.rotateKey` | `agent.logs`. */
  name: string;
  args?: Record<string, unknown>;
  actor?: string;
  /** `done` | `failed`. */
  status: string;
  result?: unknown;
  error?: IAgentErrorDto;
  createdAt: number;
  finishedAt: number;
  /** Итог отложенной замены воркера (ждала окончания работы). */
  deferred?: boolean;
}
