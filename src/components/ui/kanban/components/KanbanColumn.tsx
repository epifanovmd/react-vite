import { cn } from "@utils/cn";
import type { MouseEvent, ReactNode } from "react";

import { useKanbanColumn } from "../hooks";
import type {
  KanbanCardData,
  KanbanCardRenderMeta,
  KanbanColumnData,
} from "../Kanban.types";
import { kanbanColumnVariants } from "../kanbanVariants";
import { KanbanCardItem } from "./KanbanCardItem";
import { KanbanColumnEmpty } from "./KanbanColumnEmpty";
import { KanbanColumnHeaderCell } from "./KanbanColumnHeaderCell";

export interface KanbanColumnProps<
  TCard extends KanbanCardData,
  TColumn extends KanbanColumnData,
> {
  column: TColumn;
  cards: TCard[];
  isOver?: boolean;
  isInvalidTarget?: boolean;
  isPreviewValid?: boolean;
  isPreviewInvalid?: boolean;
  isCardDraggable?: (card: TCard) => boolean;
  onCardClick?: (card: TCard, event: MouseEvent<HTMLDivElement>) => void;
  renderCard: (card: TCard, meta: KanbanCardRenderMeta) => ReactNode;
  renderHeader?: (column: TColumn, count: number) => ReactNode;
  renderEmpty?: (column: TColumn) => ReactNode;
  className?: string;
  cardClassName?: string;
  disabled?: boolean;
}

export const KanbanColumn = <
  TCard extends KanbanCardData,
  TColumn extends KanbanColumnData,
>(
  props: KanbanColumnProps<TCard, TColumn>,
) => {
  const {
    column,
    cards,
    isOver,
    isInvalidTarget,
    isPreviewValid,
    isPreviewInvalid,
    isCardDraggable,
    onCardClick,
    renderCard,
    renderHeader,
    renderEmpty,
    className,
    cardClassName,
    disabled,
  } = props;

  const { ref } = useKanbanColumn({ id: column.id, disabled });

  return (
    <section
      ref={ref}
      className={cn(
        kanbanColumnVariants({
          isOver,
          isInvalid: isInvalidTarget,
          previewValid: isPreviewValid,
          previewInvalid: isPreviewInvalid,
        }),
        className,
      )}
    >
      <KanbanColumnHeaderCell
        column={column}
        count={cards.length}
        renderHeader={renderHeader}
      />

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 pb-3">
        {cards.map((card, index) => (
          <KanbanCardItem
            key={card.id}
            id={card.id}
            index={index}
            columnId={column.id}
            data={card}
            disabled={disabled || isCardDraggable?.(card) === false}
            className={cardClassName}
            renderCard={renderCard}
            onCardClick={onCardClick}
          />
        ))}

        {cards.length === 0 &&
          (renderEmpty ? renderEmpty(column) : <KanbanColumnEmpty />)}
      </div>
    </section>
  );
};
