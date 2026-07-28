import type { UniqueIdentifier } from "@dnd-kit/abstract";
import type { MouseEvent, ReactNode } from "react";

export interface KanbanCardData {
  id: UniqueIdentifier;
}

export interface KanbanColumnData {
  id: UniqueIdentifier;
  title: ReactNode;
}

export type KanbanItems<TCard extends KanbanCardData> = Record<
  UniqueIdentifier,
  TCard[]
>;

export interface KanbanCardRenderMeta {
  dragHandleRef: (element: Element | null) => void;
  isDragging: boolean;
}

export interface KanbanCardDropEvent<TCard extends KanbanCardData> {
  card: TCard;
  fromColumnId: UniqueIdentifier;
  toColumnId: UniqueIdentifier;
  fromIndex: number;
  toIndex: number;
}

export interface KanbanCanDropContext<TCard extends KanbanCardData> {
  card: TCard;
  fromColumnId: UniqueIdentifier;
  toColumnId: UniqueIdentifier;
  items: KanbanItems<TCard>;
}

export type KanbanCanDropCard<TCard extends KanbanCardData> = (
  context: KanbanCanDropContext<TCard>,
) => boolean;

export type KanbanWorkflow = Record<UniqueIdentifier, UniqueIdentifier[]>;

export interface KanbanProps<
  TCard extends KanbanCardData,
  TColumn extends KanbanColumnData,
> {
  columns: TColumn[];

  items?: KanbanItems<TCard>;
  defaultItems?: KanbanItems<TCard>;
  onItemsChange?: (items: KanbanItems<TCard>) => void;
  onCardDrop?: (event: KanbanCardDropEvent<TCard>) => void;
  canDropCard?: KanbanCanDropCard<TCard>;
  workflow?: KanbanWorkflow;
  isCardDraggable?: (card: TCard) => boolean;
  onCardClick?: (card: TCard, event: MouseEvent<HTMLDivElement>) => void;
  highlightOnDragStart?: boolean;

  renderCard: (card: TCard, meta: KanbanCardRenderMeta) => ReactNode;
  renderColumnHeader?: (column: TColumn, count: number) => ReactNode;
  renderColumnEmpty?: (column: TColumn) => ReactNode;

  className?: string;
  columnClassName?: string;
  cardClassName?: string;
  disabled?: boolean;
}
