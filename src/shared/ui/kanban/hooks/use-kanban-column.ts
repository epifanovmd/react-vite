import { CollisionPriority, type UniqueIdentifier } from "@dnd-kit/abstract";
import { useDroppable } from "@dnd-kit/react";

export interface UseKanbanColumnOptions {
  id: UniqueIdentifier;
  disabled?: boolean;
}

export interface UseKanbanColumnResult {
  ref: (element: Element | null) => void;
  isDropTarget: boolean;
}

export const useKanbanColumn = (
  options: UseKanbanColumnOptions,
): UseKanbanColumnResult => {
  const { id, disabled } = options;

  const { ref, isDropTarget } = useDroppable({
    id,
    type: "column",
    accept: "card",
    collisionPriority: CollisionPriority.Low,
    disabled,
  });

  return { ref, isDropTarget };
};
