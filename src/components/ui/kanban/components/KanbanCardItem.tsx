import type { UniqueIdentifier } from "@dnd-kit/abstract";
import { cn } from "@utils/cn";
import type { MouseEvent, ReactNode } from "react";

import { useKanbanCard } from "../hooks";
import type { KanbanCardData, KanbanCardRenderMeta } from "../Kanban.types";
import { kanbanCardVariants } from "../kanbanVariants";

export interface KanbanCardItemProps<TCard extends KanbanCardData> {
  id: UniqueIdentifier;
  index: number;
  columnId: UniqueIdentifier;
  data: TCard;
  disabled?: boolean;
  className?: string;
  renderCard: (card: TCard, meta: KanbanCardRenderMeta) => ReactNode;
  onCardClick?: (card: TCard, event: MouseEvent<HTMLDivElement>) => void;
}

export const KanbanCardItem = <TCard extends KanbanCardData>(
  props: KanbanCardItemProps<TCard>,
) => {
  const {
    id,
    index,
    columnId,
    data,
    disabled,
    className,
    renderCard,
    onCardClick,
  } = props;

  const { ref, handleRef, isDragging } = useKanbanCard({
    id,
    index,
    columnId,
    data,
    disabled,
  });

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-roledescription="draggable card"
      onClick={onCardClick && (event => onCardClick(data, event))}
      className={cn(
        kanbanCardVariants({ isDragging }),
        disabled && "cursor-default opacity-70 active:cursor-default",
        className,
      )}
    >
      {renderCard(data, { dragHandleRef: handleRef, isDragging })}
    </div>
  );
};
