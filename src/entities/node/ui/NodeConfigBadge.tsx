import type { INodeConfigDto } from "@shared/api/gen/main/model";
import { Badge, Tooltip } from "@shared/ui";
import { FC } from "react";

import { nodeConfigView } from "../lib/status";

interface NodeConfigBadgeProps {
  config: INodeConfigDto;
}

/** Сводка конфигурации узла; разделы с ошибкой и в ожидании — в подсказке. */
export const NodeConfigBadge: FC<NodeConfigBadgeProps> = ({ config }) => {
  const view = nodeConfigView(config);
  const badge = <Badge variant={view.variant}>{view.label}</Badge>;

  return view.hint ? (
    <Tooltip content={view.hint}>
      <span className="inline-flex">{badge}</span>
    </Tooltip>
  ) : (
    badge
  );
};
