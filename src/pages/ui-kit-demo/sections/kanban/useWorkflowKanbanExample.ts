import type { KanbanCardDropEvent } from "@shared/ui";
import { useCallback, useState } from "react";

import {
  COLUMN_TITLE_BY_ID,
  LOCKABLE_CARD_ID,
  type TaskCard,
  WORKFLOW,
} from "./workflow-kanban.data";

const isUnlockedCard = (card: TaskCard) => card.id !== LOCKABLE_CARD_ID;

const getColumnTitle = (columnId: string) =>
  COLUMN_TITLE_BY_ID.get(columnId) ?? columnId;

const formatDropMessage = (event: KanbanCardDropEvent<TaskCard>) =>
  `«${event.card.title}»: ${getColumnTitle(event.fromColumnId)} → ${getColumnTitle(event.toColumnId)} (позиция ${event.toIndex + 1})`;

/** Состояние переключателей и обработчики демо-доски воркфлоу. */
export const useWorkflowKanbanExample = () => {
  const [lastMove, setLastMove] = useState<string | null>(null);
  const [lastClicked, setLastClicked] = useState<string | null>(null);
  const [enforceWorkflow, setEnforceWorkflow] = useState(true);
  const [lockLastCard, setLockLastCard] = useState(true);
  const [handleOnly, setHandleOnly] = useState(false);
  const [boardDisabled, setBoardDisabled] = useState(false);
  const [highlightOnDragStart, setHighlightOnDragStart] = useState(true);

  const onCardClick = useCallback(
    (card: TaskCard) => setLastClicked(card.title),
    [],
  );

  const onCardDrop = useCallback(
    (event: KanbanCardDropEvent<TaskCard>) =>
      setLastMove(formatDropMessage(event)),
    [],
  );

  const isCardLocked = useCallback(
    (card: TaskCard) => lockLastCard && card.id === LOCKABLE_CARD_ID,
    [lockLastCard],
  );

  return {
    lastMove,
    lastClicked,
    enforceWorkflow,
    setEnforceWorkflow,
    lockLastCard,
    setLockLastCard,
    handleOnly,
    setHandleOnly,
    boardDisabled,
    setBoardDisabled,
    highlightOnDragStart,
    setHighlightOnDragStart,
    workflow: enforceWorkflow ? WORKFLOW : undefined,
    isCardDraggable: lockLastCard ? isUnlockedCard : undefined,
    highlight: enforceWorkflow && highlightOnDragStart,
    isCardLocked,
    onCardClick,
    onCardDrop,
  };
};
