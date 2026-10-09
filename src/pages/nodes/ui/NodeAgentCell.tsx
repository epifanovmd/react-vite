import { nodeWorkersSummary } from "@entities/node";
import type { NodeDto } from "@shared/api/gen/main/model";
import { Badge, Tooltip } from "@shared/ui";
import { FC } from "react";

interface NodeAgentCellProps {
  node: NodeDto;
}

/** Агент узла: версия, обновление, воркеры; не выходил на связь — так и пишем. */
export const NodeAgentCell: FC<NodeAgentCellProps> = ({ node }) => {
  const { agent } = node;
  const workers = nodeWorkersSummary(node);

  if (!agent) {
    return <span className="text-xs text-muted-foreground">не установлен</span>;
  }

  return (
    <div className="text-xs text-muted-foreground">
      <p className="flex items-center gap-1.5">
        {agent.version ?? "—"}
        {agent.updateAvailable && (
          <Tooltip content="Есть новая версия агента">
            <Badge variant="warning">обновление</Badge>
          </Tooltip>
        )}
      </p>
      {agent.online && workers.total > 0 && (
        <p className={workers.troubled > 0 ? "text-warning" : undefined}>
          воркеров {workers.total}
          {workers.troubled > 0 && ` · не в порядке ${workers.troubled}`}
        </p>
      )}
      {/* Сколько прошло с последней связи — в статусе узла. */}
      {!agent.online && !agent.lastSeenAt && <p>не выходил на связь</p>}
    </div>
  );
};
