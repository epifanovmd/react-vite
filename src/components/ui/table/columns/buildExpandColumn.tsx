import { type ColumnDef, type Row } from "@tanstack/react-table";
import { cn } from "@utils/cn";
import { ChevronRight } from "lucide-react";
import type { MouseEvent } from "react";

export const buildExpandColumn = <TData,>(): ColumnDef<TData> => ({
  id: "__expand__",
  size: 32,
  maxSize: 32,
  enableSorting: false,
  enableGlobalFilter: false,
  enableColumnFilter: false,
  enableHiding: false,
  cell: ({ row }: { row: Row<TData> }) => {
    if (!row.getCanExpand()) return null;

    return (
      <button
        type="button"
        aria-label={row.getIsExpanded() ? "Свернуть строку" : "Развернуть строку"}
        className="inline-flex h-5 w-5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        style={{ marginLeft: row.depth * 16 }}
        onClick={(e: MouseEvent) => {
          e.stopPropagation();
          row.getToggleExpandedHandler()();
        }}
      >
        <ChevronRight
          className={cn(
            "h-3.5 w-3.5 transition-transform",
            row.getIsExpanded() && "rotate-90",
          )}
        />
      </button>
    );
  },
});
