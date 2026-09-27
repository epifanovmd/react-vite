import type { BadgeProps, KanbanColumnData, KanbanWorkflow } from "@shared/ui";
import type { FC } from "react";
import { useMemo } from "react";

import { WorkflowDiagramRow } from "./WorkflowDiagramRow";

export interface WorkflowDiagramProps {
  columns: KanbanColumnData[];
  workflow: KanbanWorkflow;
  columnVariant: Record<string, NonNullable<BadgeProps["variant"]>>;
}

const NO_TARGETS: string[] = [];

export const WorkflowDiagram: FC<WorkflowDiagramProps> = ({
  columns,
  workflow,
  columnVariant,
}) => {
  const columnIndex = useMemo(
    () => new Map(columns.map((column, index) => [column.id, index])),
    [columns],
  );
  const titleById = useMemo(
    () => new Map(columns.map(column => [column.id, column.title])),
    [columns],
  );

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-surface-1 p-3">
      {columns.map(column => (
        <WorkflowDiagramRow
          key={column.id}
          column={column}
          targets={workflow[column.id] ?? NO_TARGETS}
          columnIndex={columnIndex}
          titleById={titleById}
          columnVariant={columnVariant}
        />
      ))}
    </div>
  );
};
