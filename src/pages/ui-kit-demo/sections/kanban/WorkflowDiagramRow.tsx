import { Badge, type BadgeProps, type KanbanColumnData } from "@shared/ui";
import { ArrowRight, Undo2 } from "lucide-react";
import type { FC, ReactNode } from "react";

export interface WorkflowDiagramRowProps {
  column: KanbanColumnData;
  /** Разрешённые переходы из колонки. */
  targets: string[];
  /** Позиция колонок на доске: переходы левее текущей считаются возвратом. */
  columnIndex: Map<string, number>;
  titleById: Map<string, ReactNode>;
  columnVariant: Record<string, NonNullable<BadgeProps["variant"]>>;
}

/** Строка графа статусов: колонка, переходы вперёд и возвраты. */
export const WorkflowDiagramRow: FC<WorkflowDiagramRowProps> = ({
  column,
  targets,
  columnIndex,
  titleById,
  columnVariant,
}) => {
  const currentIndex = columnIndex.get(column.id) ?? 0;
  const forward = targets.filter(
    id => (columnIndex.get(id) ?? 0) > currentIndex,
  );
  const backward = targets.filter(
    id => (columnIndex.get(id) ?? 0) <= currentIndex,
  );
  const isFinal = targets.length === 0;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
      <Badge
        variant={columnVariant[column.id] ?? "muted"}
        className="min-w-28 justify-center"
      >
        {column.title}
      </Badge>

      {isFinal && (
        <span className="text-muted-foreground">конечный статус</span>
      )}

      {!isFinal && (
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
};
