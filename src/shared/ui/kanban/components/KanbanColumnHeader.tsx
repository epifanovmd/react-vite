import type { ReactNode } from "react";

import { Badge } from "../../badge";

export interface KanbanColumnHeaderProps {
  title: ReactNode;
  count: number;
}

export const KanbanColumnHeader = ({
  title,
  count,
}: KanbanColumnHeaderProps) => (
  <div className="flex items-center justify-between gap-2 px-3.5 py-3">
    <span className="truncate text-sm font-medium text-foreground">
      {title}
    </span>
    <Badge variant="muted">{count}</Badge>
  </div>
);
