import { formatPercent, pointHost, usagePercent } from "@entities/agent";
import type { IAgentMetricsPointDto } from "@shared/api/gen/main/model";
import { FC } from "react";

interface NodeLoadCellProps {
  /** Последняя точка метрик агента узла; нет или агент не на связи — `null`. */
  point: IAgentMetricsPointDto | null;
}

/** Нагрузка кратко: процессор, память, средняя нагрузка за минуту. */
export const NodeLoadCell: FC<NodeLoadCellProps> = ({ point }) => {
  const host = point ? pointHost(point) : undefined;

  if (!host) return <span className="text-xs text-muted-foreground">—</span>;

  const memory = usagePercent(host.memUsedBytes, host.memTotalBytes);

  return (
    <div className="font-mono text-xs text-muted-foreground">
      <p>
        ЦП {formatPercent(host.cpuPercent)} · ОЗУ {formatPercent(memory)}
      </p>
      {host.load1 != null && <p>нагрузка {host.load1.toFixed(2)}</p>}
    </div>
  );
};
