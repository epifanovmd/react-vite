import type { UniqueIdentifier } from "@dnd-kit/abstract";
import { SortableKeyboardPlugin } from "@dnd-kit/dom/sortable";
import { useSortable } from "@dnd-kit/react/sortable";

import type { KanbanCardData } from "../Kanban.types";

export interface UseKanbanCardOptions<TCard extends KanbanCardData> {
  id: UniqueIdentifier;
  index: number;
  columnId: UniqueIdentifier;
  data: TCard;
  disabled?: boolean;
}

export interface UseKanbanCardResult {
  ref: (element: Element | null) => void;
  handleRef: (element: Element | null) => void;
  isDragging: boolean;
  isDropTarget: boolean;
}

export const useKanbanCard = <TCard extends KanbanCardData>(
  options: UseKanbanCardOptions<TCard>,
): UseKanbanCardResult => {
  const { id, index, columnId, data, disabled } = options;

  const { ref, handleRef, isDragging, isDropTarget } = useSortable({
    id,
    index,
    group: columnId,
    type: "card",
    accept: "card",
    data,
    disabled,
    plugins: [SortableKeyboardPlugin],
  });

  return { ref, handleRef, isDragging, isDropTarget };
};
