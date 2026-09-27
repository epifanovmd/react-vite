import { cn } from "@shared/lib/utils/cn";
import { Avatar, Badge, type KanbanCardRenderMeta } from "@shared/ui";
import { GripVertical, Lock } from "lucide-react";
import type { FC } from "react";

import {
  PRIORITY_LABEL,
  PRIORITY_VARIANT,
  type TaskCard,
} from "./workflow-kanban.data";

interface TaskCardViewProps {
  card: TaskCard;
  meta: KanbanCardRenderMeta;
  /** Показывать ручку перетаскивания. */
  handleOnly: boolean;
  /** Показывать значок блокировки. */
  locked: boolean;
}

/** Содержимое карточки задачи на доске. */
export const TaskCardView: FC<TaskCardViewProps> = ({
  card,
  meta,
  handleOnly,
  locked,
}) => (
  <div className="flex flex-col gap-2 p-3">
    <div className="flex items-start gap-2">
      {handleOnly && (
        <GripVertical
          ref={meta.dragHandleRef}
          className="mt-0.5 size-4 shrink-0 cursor-grab text-muted-foreground active:cursor-grabbing"
        />
      )}
      <span className="flex-1 text-sm font-medium leading-snug text-foreground">
        {card.title}
      </span>
      {locked && (
        <Lock className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
      )}
    </div>
    <div
      className={cn("flex items-center justify-between", handleOnly && "pl-6")}
    >
      <Badge variant={PRIORITY_VARIANT[card.priority]}>
        {PRIORITY_LABEL[card.priority]}
      </Badge>
      <Avatar size="sm" name={card.assignee} />
    </div>
  </div>
);
