import type { AgentAlertDto } from "@shared/api/gen/main/model";
import { Card, Tooltip } from "@shared/ui";
import { FC, ReactNode } from "react";

import { alertKey } from "../lib/agent";
import { formatAgo, formatMoment } from "../lib/format";
import { AgentAlertBadge } from "./AgentAlertBadge";

interface AgentAlertsCardProps {
  alerts: AgentAlertDto[];
  /** Агент проблемы (в общем списке — ссылка); без него — не показывается. */
  renderAgent?: (alert: AgentAlertDto) => ReactNode;
}

/** Активные проблемы агентов: нет связи, воркер упал, настройка не применилась. */
export const AgentAlertsCard: FC<AgentAlertsCardProps> = ({
  alerts,
  renderAgent,
}) => {
  if (alerts.length === 0) return null;

  return (
    <Card
      title={`Проблемы · ${alerts.length}`}
      description="Пропадут сами, когда всё наладится"
    >
      <ul className="flex flex-col divide-y divide-border">
        {alerts.map(alert => (
          <li
            key={alertKey(alert)}
            className="flex flex-wrap items-center gap-x-2 gap-y-1 py-2 text-sm first:pt-0 last:pb-0"
          >
            <AgentAlertBadge type={alert.type} />
            {renderAgent?.(alert)}
            {alert.worker && (
              <span className="text-muted-foreground">
                воркер {alert.worker}
                {alert.configKey && ` · ключ ${alert.configKey}`}
              </span>
            )}
            <span className="min-w-0 flex-1">{alert.message}</span>
            <Tooltip content={`С ${formatMoment(alert.since)}`}>
              <span className="text-xs text-muted-foreground">
                {formatAgo(alert.since)}
              </span>
            </Tooltip>
          </li>
        ))}
      </ul>
    </Card>
  );
};
