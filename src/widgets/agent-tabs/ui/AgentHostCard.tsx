import {
  AgentLabels,
  formatAgo,
  formatMoment,
  type IAgentHostMetrics,
} from "@entities/agent";
import type { AgentDto } from "@shared/api/gen/main/model";
import { Card, InfoField } from "@shared/ui";
import { FC } from "react";

interface AgentHostCardProps {
  agent: AgentDto;
  host: IAgentHostMetrics | undefined;
}

const GRID_CLASS = "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4";

/** Длительность в секундах: «3 д 4 ч», «5 ч 12 мин», «40 мин». */
const formatUptime = (seconds: number | undefined): string | undefined => {
  if (seconds === undefined) return undefined;

  const days = Math.floor(seconds / 86_400);
  const hours = Math.floor((seconds % 86_400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) return `${days} д ${hours} ч`;
  if (hours > 0) return `${hours} ч ${minutes} мин`;

  return `${minutes} мин`;
};

/**
 * Сведения об агенте и узле, которых нет в шапке: ядро, время работы,
 * подключение, регистрация, метки. Имя узла, ОС, адрес и версия — в шапке.
 */
export const AgentHostCard: FC<AgentHostCardProps> = ({ agent, host }) => (
  <Card title="Агент и узел">
    <div className={GRID_CLASS}>
      <InfoField label="Ядро" value={agent.host?.kernel} />
      <InfoField label="Узел работает" value={formatUptime(host?.uptimeSec)} />
      <InfoField
        label="Агент запущен"
        value={agent.startedAt ? formatAgo(agent.startedAt) : undefined}
      />
      <InfoField
        label={agent.online ? "На связи с" : "Последняя связь"}
        value={formatMoment(
          agent.online ? agent.connectedAt : agent.lastSeenAt,
        )}
      />
      <InfoField
        label="Зарегистрирован"
        value={formatMoment(agent.enrolledAt)}
      />
      <InfoField
        label="Статус агента"
        value={agent.statusAt ? formatAgo(agent.statusAt) : undefined}
        emptyText="не присылал"
      />
      <InfoField
        label="Процесс сервера"
        value={
          agent.session && (
            <span className="font-mono">{agent.session.instance}</span>
          )
        }
        emptyText="нет соединения"
      />
      <InfoField
        label="Метки"
        truncate={false}
        value={<AgentLabels labels={agent.labels} emptyText="нет" />}
      />
    </div>
  </Card>
);
