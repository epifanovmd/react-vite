import type { NodeDto } from "@shared/api/gen/main/model";
import { useTimeSince } from "@shared/lib/hooks";
import { Badge, Tooltip } from "@shared/ui";
import { FC } from "react";

import { NODE_STATUS } from "../lib/status";

interface NodeStatusBadgeProps {
  node: Pick<NodeDto, "status" | "statusMessage"> & {
    agent?: Pick<NonNullable<NodeDto["agent"]>, "lastSeenAt"> | null;
  };
}

/**
 * Статус узла; пояснение сервера — в подсказке. Без связи — сколько прошло
 * с последней связи агента (обновляется само).
 */
export const NodeStatusBadge: FC<NodeStatusBadgeProps> = ({ node }) => {
  const view = NODE_STATUS[node.status];
  const since = useTimeSince(
    node.status === "offline" ? node.agent?.lastSeenAt : null,
  );
  const badge = (
    <Badge variant={view.variant} dot>
      {since ? `${view.label} · ${since}` : view.label}
    </Badge>
  );

  return node.statusMessage ? (
    <Tooltip content={node.statusMessage}>
      <span className="inline-flex">{badge}</span>
    </Tooltip>
  ) : (
    badge
  );
};
