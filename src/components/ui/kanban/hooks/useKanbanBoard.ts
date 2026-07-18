import type { UniqueIdentifier } from "@dnd-kit/abstract";
import { move } from "@dnd-kit/helpers";
import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import { useCallback, useRef, useState } from "react";

import type {
  KanbanCanDropCard,
  KanbanCanDropContext,
  KanbanCardData,
  KanbanCardDropEvent,
  KanbanItems,
  KanbanWorkflow,
} from "../Kanban.types";
import { useControllableState } from "./useControllableState";

export interface UseKanbanBoardOptions<TCard extends KanbanCardData> {
  items?: KanbanItems<TCard>;
  defaultItems?: KanbanItems<TCard>;
  onItemsChange?: (items: KanbanItems<TCard>) => void;
  onCardDrop?: (event: KanbanCardDropEvent<TCard>) => void;
  canDropCard?: KanbanCanDropCard<TCard>;
  workflow?: KanbanWorkflow;
  columnIds?: UniqueIdentifier[];
  highlightOnDragStart?: boolean;
  disabled?: boolean;
}

export interface UseKanbanBoardResult<TCard extends KanbanCardData> {
  items: KanbanItems<TCard>;
  activeCard: TCard | null;
  hoverColumnId: UniqueIdentifier | null;
  invalidDropColumnId: UniqueIdentifier | null;
  columnValidity: Record<UniqueIdentifier, boolean> | null;
  onDragStart: (event: DragStartEvent) => void;
  onDragOver: (event: DragOverEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
}

interface DragOrigin {
  columnId: UniqueIdentifier;
  index: number;
}

const findCardColumnId = <TCard extends KanbanCardData>(
  items: KanbanItems<TCard>,
  cardId: UniqueIdentifier,
): UniqueIdentifier | null => {
  for (const columnId of Object.keys(items)) {
    if (items[columnId].some(card => card.id === cardId)) return columnId;
  }

  return null;
};

export const useKanbanBoard = <TCard extends KanbanCardData>(
  options: UseKanbanBoardOptions<TCard>,
): UseKanbanBoardResult<TCard> => {
  const {
    items: controlledItems,
    defaultItems,
    onItemsChange,
    onCardDrop,
    canDropCard,
    workflow,
    columnIds,
    highlightOnDragStart,
    disabled,
  } = options;

  const hasDropValidation = !!workflow || !!canDropCard;

  const checkCanDrop = useCallback(
    (context: KanbanCanDropContext<TCard>): boolean => {
      if (
        workflow &&
        !(workflow[context.fromColumnId] ?? []).includes(context.toColumnId)
      ) {
        return false;
      }

      return canDropCard ? canDropCard(context) : true;
    },
    [workflow, canDropCard],
  );

  const [items, setItems] = useControllableState<KanbanItems<TCard>>({
    value: controlledItems,
    defaultValue: defaultItems ?? {},
    onChange: onItemsChange,
  });

  const [activeCard, setActiveCard] = useState<TCard | null>(null);
  const [hoverColumnId, setHoverColumnId] = useState<UniqueIdentifier | null>(
    null,
  );
  const [invalidDropColumnId, setInvalidDropColumnId] =
    useState<UniqueIdentifier | null>(null);
  const [columnValidity, setColumnValidity] = useState<Record<
    UniqueIdentifier,
    boolean
  > | null>(null);

  const itemsRef = useRef(items);

  itemsRef.current = items;

  const invalidDropColumnIdRef = useRef(invalidDropColumnId);

  invalidDropColumnIdRef.current = invalidDropColumnId;

  const snapshotRef = useRef<KanbanItems<TCard> | null>(null);
  const originRef = useRef<DragOrigin | null>(null);

  const onDragStart = useCallback(
    (event: DragStartEvent) => {
      if (disabled) return;

      const { source } = event.operation;

      if (!isSortable(source)) return;

      const columnId = source.initialGroup as UniqueIdentifier;

      snapshotRef.current = itemsRef.current;
      originRef.current = { columnId, index: source.initialIndex };
      setActiveCard((source.data as TCard) ?? null);
      setHoverColumnId(columnId);

      if (highlightOnDragStart && hasDropValidation && columnIds) {
        const card = source.data as TCard;
        const validity: Record<UniqueIdentifier, boolean> = {};

        for (const id of columnIds) {
          validity[id] =
            id === columnId ||
            checkCanDrop({
              card,
              fromColumnId: columnId,
              toColumnId: id,
              items: itemsRef.current,
            });
        }

        setColumnValidity(validity);
      } else {
        setColumnValidity(null);
      }
    },
    [
      disabled,
      hasDropValidation,
      checkCanDrop,
      columnIds,
      highlightOnDragStart,
    ],
  );

  const onDragOver = useCallback(
    (event: DragOverEvent) => {
      if (disabled) return;

      const { source } = event.operation;

      if (!isSortable(source)) return;

      const origin = originRef.current;

      const candidateItems = move(itemsRef.current, event);
      const candidateColumnId = findCardColumnId(candidateItems, source.id);

      const isRejectedTransition =
        hasDropValidation &&
        !!origin &&
        candidateColumnId != null &&
        candidateColumnId !== origin.columnId &&
        !checkCanDrop({
          card: source.data as TCard,
          fromColumnId: origin.columnId,
          toColumnId: candidateColumnId,
          items: itemsRef.current,
        });

      setHoverColumnId(candidateColumnId);

      if (isRejectedTransition) {
        setInvalidDropColumnId(candidateColumnId);

        return;
      }

      setInvalidDropColumnId(null);
      setItems(candidateItems);
    },
    [disabled, hasDropValidation, checkCanDrop, setItems],
  );

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (disabled) return;

      const { source } = event.operation;
      const origin = originRef.current;

      if (isSortable(source) && origin) {
        const wasRejected = invalidDropColumnIdRef.current != null;

        if (event.canceled || wasRejected) {
          if (snapshotRef.current) setItems(snapshotRef.current);
        } else if (onCardDrop) {
          const finalColumnId =
            findCardColumnId(itemsRef.current, source.id) ?? origin.columnId;
          const foundIndex = (itemsRef.current[finalColumnId] ?? []).findIndex(
            card => card.id === source.id,
          );
          const finalIndex = foundIndex === -1 ? origin.index : foundIndex;
          const hasMoved =
            origin.columnId !== finalColumnId || origin.index !== finalIndex;

          if (hasMoved) {
            onCardDrop({
              card: source.data as TCard,
              fromColumnId: origin.columnId,
              toColumnId: finalColumnId,
              fromIndex: origin.index,
              toIndex: finalIndex,
            });
          }
        }
      }

      snapshotRef.current = null;
      originRef.current = null;
      setActiveCard(null);
      setInvalidDropColumnId(null);
      setHoverColumnId(null);
      setColumnValidity(null);
    },
    [disabled, onCardDrop, setItems],
  );

  return {
    items,
    activeCard,
    hoverColumnId,
    invalidDropColumnId,
    columnValidity,
    onDragStart,
    onDragOver,
    onDragEnd,
  };
};
