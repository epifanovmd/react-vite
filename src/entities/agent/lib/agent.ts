import type {
  AgentAlertDto,
  AgentDto,
  IAgentWorkerDto,
} from "@shared/api/gen/main/model";

import { isWorkerTroubled } from "./status";

/** Версия программы агента; не выходил на связь — `null`. */
export const agentVersion = (agent: AgentDto): string | null =>
  agent.version ?? null;

/** Имя узла агента. */
export const agentHostname = (agent: AgentDto): string | null =>
  agent.host?.hostname ?? null;

/** ОС узла: «linux · amd64». */
export const agentPlatform = (agent: AgentDto): string | null =>
  [agent.host?.os, agent.host?.arch].filter(Boolean).join(" · ") || null;

/** Узел одной строкой: имя, ОС, адрес. */
export const agentSubtitle = (agent: AgentDto): string =>
  [agentHostname(agent), agentPlatform(agent), agent.address]
    .filter(Boolean)
    .join(" · ") || "агент ещё не выходил на связь";

/** Метки «ключ=значение». */
export const agentLabels = (labels: Record<string, string>): string[] =>
  Object.entries(labels)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => (value ? `${key}=${value}` : key));

/** Агент на связи и не отозван: действия и живые данные доступны. */
export const isAgentLive = (agent: AgentDto): boolean =>
  agent.online && !agent.revoked;

/** Воркеры агента; встроенный (метрики узла) — в конце. */
export const agentWorkers = (agent: AgentDto): IAgentWorkerDto[] => [
  ...agent.workers.filter(worker => !worker.builtin),
  ...agent.workers.filter(worker => worker.builtin),
];

/** Воркеры из настроек агента: у них бывают маршруты и настройки. */
export const configuredWorkers = (agent: AgentDto): IAgentWorkerDto[] =>
  agent.workers.filter(worker => !worker.builtin);

/** Воркер по имени. */
export const workerOf = (
  agent: AgentDto,
  name: string,
): IAgentWorkerDto | undefined =>
  agent.workers.find(worker => worker.name === name);

/**
 * Сколько воркеров из настроек агента и сколько из них не в порядке.
 * Встроенный воркер в сводку не входит.
 */
export const workersSummary = (
  agent: AgentDto,
): { total: number; troubled: number } => {
  const workers = configuredWorkers(agent);

  return {
    total: workers.length,
    troubled: workers.filter(isWorkerTroubled).length,
  };
};

/** Агенты на связи — первыми, дальше по имени. */
export const onlineAgentFirst = (a: AgentDto, b: AgentDto): number =>
  Number(isAgentLive(b)) - Number(isAgentLive(a)) ||
  a.name.localeCompare(b.name);

/** Ключ проблемы: сервер даёт ключ, уникальный в пределах агента. */
export const alertKey = (alert: AgentAlertDto): string =>
  `${alert.agentId}/${alert.key}`;
