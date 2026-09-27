import { ArrowLeft, ArrowRight } from "lucide-react";
import type { FC } from "react";

import { COLUMN_LABELS } from "./column-labels";

interface ColumnOrderChipProps {
  id: string;
  isFirst: boolean;
  isLast: boolean;
  onMove: (id: string, direction: -1 | 1) => void;
}

const MOVE_BUTTON_CLASS =
  "text-muted-foreground hover:text-foreground disabled:opacity-30";

/** Чип колонки с кнопками сдвига влево/вправо. */
export const ColumnOrderChip: FC<ColumnOrderChipProps> = ({
  id,
  isFirst,
  isLast,
  onMove,
}) => {
  const label = COLUMN_LABELS[id] ?? id;

  const handleMoveLeft = () => onMove(id, -1);
  const handleMoveRight = () => onMove(id, 1);

  return (
    <div className="flex items-center gap-0.5 rounded-md border px-1.5 py-1 text-xs">
      <button
        type="button"
        disabled={isFirst}
        onClick={handleMoveLeft}
        className={MOVE_BUTTON_CLASS}
        aria-label={`Сдвинуть ${label} влево`}
      >
        <ArrowLeft className="h-3.5 w-3.5" />
      </button>
      <span>{label}</span>
      <button
        type="button"
        disabled={isLast}
        onClick={handleMoveRight}
        className={MOVE_BUTTON_CLASS}
        aria-label={`Сдвинуть ${label} вправо`}
      >
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
