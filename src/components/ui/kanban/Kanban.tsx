import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import { cn } from "@utils/cn";
import { useMemo } from "react";

import { KanbanColumn } from "./components";
import { useKanbanBoard } from "./hooks";
import type {
  KanbanCardData,
  KanbanColumnData,
  KanbanProps,
} from "./Kanban.types";
import { kanbanBoardVariants, kanbanCardVariants } from "./kanbanVariants";

export const Kanban = <
  TCard extends KanbanCardData,
  TColumn extends KanbanColumnData,
>(
  props: KanbanProps<TCard, TColumn>,
) => {
  const {
    columns,
    items: controlledItems,
    defaultItems,
    onItemsChange,
    onCardDrop,
    canDropCard,
    workflow,
    isCardDraggable,
    onCardClick,
    highlightOnDragStart,
    renderCard,
    renderColumnHeader,
    renderColumnEmpty,
    className,
    columnClassName,
    cardClassName,
    disabled,
  } = props;

  const columnIds = useMemo(() => columns.map(column => column.id), [columns]);

  const {
    items,
    activeCard,
    hoverColumnId,
    invalidDropColumnId,
    columnValidity,
    onDragStart,
    onDragOver,
    onDragEnd,
  } = useKanbanBoard({
    items: controlledItems,
    defaultItems,
    onItemsChange,
    onCardDrop,
    canDropCard,
    workflow,
    columnIds,
    highlightOnDragStart,
    disabled,
  });

  const cardOverlayMeta = useMemo(
    () => ({ dragHandleRef: () => {}, isDragging: true }),
    [],
  );

  return (
    <DragDropProvider
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className={cn(kanbanBoardVariants(), className)}>
        {columns.map(column => (
          <KanbanColumn
            key={column.id}
            column={column}
            cards={items[column.id] ?? []}
            isOver={hoverColumnId === column.id}
            isInvalidTarget={invalidDropColumnId === column.id}
            isPreviewValid={columnValidity?.[column.id] === true}
            isPreviewInvalid={columnValidity?.[column.id] === false}
            isCardDraggable={isCardDraggable}
            onCardClick={onCardClick}
            renderCard={renderCard}
            renderHeader={renderColumnHeader}
            renderEmpty={renderColumnEmpty}
            className={columnClassName}
            cardClassName={cardClassName}
            disabled={disabled}
          />
        ))}
      </div>

      <DragOverlay>
        {activeCard && (
          <div
            className={cn(
              kanbanCardVariants(),
              "cursor-grabbing shadow-xl",
              invalidDropColumnId && "ring-2 ring-destructive/70",
              cardClassName,
            )}
          >
            {renderCard(activeCard, cardOverlayMeta)}
          </div>
        )}
      </DragOverlay>
    </DragDropProvider>
  );
};
