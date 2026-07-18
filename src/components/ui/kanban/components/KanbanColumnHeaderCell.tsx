import type { ReactNode } from "react";

import type { KanbanColumnData } from "../Kanban.types";
import { KanbanColumnHeader } from "./KanbanColumnHeader";

export interface KanbanColumnHeaderCellProps<TColumn extends KanbanColumnData> {
  column: TColumn;
  count: number;
  renderHeader?: (column: TColumn, count: number) => ReactNode;
}

export const KanbanColumnHeaderCell = <TColumn extends KanbanColumnData>(
  props: KanbanColumnHeaderCellProps<TColumn>,
) => {
  const { column, count, renderHeader } = props;

  return (
    <div className="pl-1.5">
      {renderHeader ? (
        renderHeader(column, count)
      ) : (
        <KanbanColumnHeader title={column.title} count={count} />
      )}
    </div>
  );
};
