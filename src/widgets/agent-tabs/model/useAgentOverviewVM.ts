import {
  freshestMetricsPoint,
  pointHost,
  useAgentLiveMetrics,
  useAgentMetricsHistory,
} from "@entities/agent";
import type { AgentDto } from "@shared/api/gen/main/model";

/**
 * Обзор агента: живые метрики, история за период и метрики узла по самой
 * свежей точке — живой или последней из карточки агента.
 */
export const useAgentOverviewVM = (agent: AgentDto) => {
  const live = useAgentLiveMetrics(agent.id);
  const history = useAgentMetricsHistory(agent.id);
  const fresher = freshestMetricsPoint(live.latest, agent.metrics);

  return {
    live,
    history,
    host: pointHost(fresher),
    /** Когда собрана точка, по которой карточки. */
    metricsAt: fresher?.at ?? null,
  };
};
