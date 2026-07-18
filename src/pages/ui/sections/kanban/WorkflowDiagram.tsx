import {
  Badge,
  type BadgeProps,
  type KanbanColumnData,
  type KanbanWorkflow,
} from "@components/ui";
import { ArrowRight, Undo2 } from "lucide-react";
import { FC } from "react";

export interface WorkflowDiagramProps {
  columns: KanbanColumnData[];
  workflow: KanbanWorkflow;
  columnVariant: Record<string, NonNullable<BadgeProps["variant"]>>;
}

export const WorkflowDiagram: FC<WorkflowDiagramProps> = ({
  columns,
  workflow,
  columnVariant,
}) => {
  const columnIndex = new Map(
    columns.map((column, index) => [column.id, index]),
  );
  const titleById = new Map(columns.map(column => [column.id, column.title]));

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-surface-1 p-3">
      {columns.map(column => {
        const targets = workflow[column.id] ?? [];
        const currentIndex = columnIndex.get(column.id) ?? 0;
        const forward = targets.filter(
          id => (columnIndex.get(id) ?? 0) > currentIndex,
        );
        const backward = targets.filter(
          id => (columnIndex.get(id) ?? 0) <= currentIndex,
        );

        return (
          <div
            key={column.id}
            className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs"
          >
            <Badge
              variant={columnVariant[column.id] ?? "muted"}
              className="min-w-28 justify-center"
            >
              {column.title}
            </Badge>

            {targets.length === 0 ? (
              <span className="text-muted-foreground">конечный статус</span>
            ) : (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                {forward.map(id => (
                  <span
                    key={id}
                    className="flex items-center gap-1 text-muted-foreground"
                  >
                    <ArrowRight className="size-3.5" />
                    <Badge variant={columnVariant[id] ?? "muted"}>
                      {titleById.get(id)}
                    </Badge>
                  </span>
                ))}
                {backward.map(id => (
                  <span
                    key={id}
                    className="flex items-center gap-1 text-muted-foreground/70"
                  >
                    <Undo2 className="size-3.5" />
                    <Badge variant="outline">{titleById.get(id)}</Badge>
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
