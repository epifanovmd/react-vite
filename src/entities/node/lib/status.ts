import {
  EJobRunStatus,
  type ENodeConfigStatus,
  type ENodeStatus,
  type INodeConfigDto,
  type INodeJobDto,
  type NodeDto,
} from "@shared/api/gen/main/model";

/** Вид бейджа: подпись и окраска. */
export interface INodeStatusView {
  label: string;
  variant: "success" | "warning" | "destructive" | "info" | "muted";
  /** Пояснение в подсказке. */
  hint?: string;
}

export const NODE_STATUS: Record<ENodeStatus, INodeStatusView> = {
  created: { label: "Ожидает агента", variant: "muted" },
  provisioning: { label: "Установка…", variant: "info" },
  online: { label: "На связи", variant: "success" },
  offline: { label: "Нет связи", variant: "destructive" },
  error: { label: "Ошибка", variant: "destructive" },
};

const CONFIG_STATUS: Record<ENodeConfigStatus, INodeStatusView> = {
  synced: { label: "Актуальна", variant: "success" },
  applying: { label: "Применяется…", variant: "warning" },
  error: { label: "Ошибка применения", variant: "destructive" },
  awaitingAgent: {
    label: "Ожидает агента",
    variant: "muted",
    hint: "Применится, когда агент узла выйдет на связь",
  },
};

/** Сводка конфигурации узла; в подсказке — разделы, где что-то не так. */
export const nodeConfigView = (config: INodeConfigDto): INodeStatusView => {
  const view = CONFIG_STATUS[config.status];
  const parts = [
    view.hint,
    config.failed.length > 0 && `Не применены: ${config.failed.join(", ")}`,
    config.pending.length > 0 &&
      `Ждут применения: ${config.pending.join(", ")}`,
  ].filter(Boolean);

  return parts.length > 0 ? { ...view, hint: parts.join(". ") } : view;
};

const ACTIVE_JOB = new Set<string>([
  EJobRunStatus.queued,
  EJobRunStatus.running,
]);

/** Задача установки или удаления агента ещё идёт. */
export const isNodeJobActive = (job: Pick<INodeJobDto, "status">): boolean =>
  ACTIVE_JOB.has(job.status);

/** Сколько узлов в каждом состоянии — для сводки. */
export interface INodeCounts {
  total: number;
  online: number;
  offline: number;
  error: number;
}

export const countNodes = (nodes: Pick<NodeDto, "status">[]): INodeCounts =>
  nodes.reduce<INodeCounts>(
    (acc, node) => ({
      total: acc.total + 1,
      online: acc.online + (node.status === "online" ? 1 : 0),
      offline: acc.offline + (node.status === "offline" ? 1 : 0),
      error: acc.error + (node.status === "error" ? 1 : 0),
    }),
    { total: 0, online: 0, offline: 0, error: 0 },
  );

/** Воркеры агента узла: сколько всего и сколько не в порядке. */
export const nodeWorkersSummary = (
  node: Pick<NodeDto, "agent">,
): { total: number; troubled: number } => {
  const workers = node.agent?.workers ?? [];

  return {
    total: workers.length,
    troubled: workers.filter(
      worker => worker.state !== "running" || worker.healthy === false,
    ).length,
  };
};
