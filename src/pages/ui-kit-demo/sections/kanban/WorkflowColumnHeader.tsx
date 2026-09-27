import { Badge, KANBAN_LABELS } from "@shared/ui";
import type { FC } from "react";

import { COLUMN_VARIANT, type WorkflowColumn } from "./workflow-kanban.data";

interface WorkflowColumnHeaderProps {
  column: WorkflowColumn;
  count: number;
}

/** Шапка колонки: цветной бейдж статуса и счётчик с учётом WIP-лимита. */
export const WorkflowColumnHeader: FC<WorkflowColumnHeaderProps> = ({
  column,
  count,
}) => {
  const overLimit = column.limit != null && count > column.limit;

  return (
    <div className="flex items-center justify-between gap-2 px-3.5 py-3">
      <Badge variant={COLUMN_VARIANT[column.id] ?? "muted"}>
        {column.title}
      </Badge>
      <Badge variant={overLimit ? "destructive" : "muted"}>
        {KANBAN_LABELS.count(count, column.limit)}
      </Badge>
    </div>
  );
};
