import { type ColumnDef, type Row } from "@tanstack/react-table";
import { ChevronDown, ChevronRight } from "lucide-react";
import type React from "react";

import { Checkbox } from "../../checkbox";

export interface RowActionsColumnOptions {
  checkboxSize: "sm" | "md";
  selectionEnabled: boolean;
  multiSelect: boolean;
}

export const buildRowActionsColumn = <TData,>({
  checkboxSize,
  selectionEnabled,
  multiSelect,
}: RowActionsColumnOptions): ColumnDef<TData> => ({
  id: "__rowActions__",
  size: 32,
  maxSize: 32,
  header: multiSelect
    ? ({ table }) => (
        <div className="flex items-center">
          <Checkbox
            size={checkboxSize}
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected()}
            onCheckedChange={(v: boolean) => table.toggleAllPageRowsSelected(v)}
            aria-label="Select all"
          />
        </div>
      )
    : undefined,
  cell: ({ row }: { row: Row<TData> }) => (
    <div className="flex items-center -ml-1">
      {row.getCanExpand() && (
        <button
          type="button"
          className="inline-flex h-6 w-6 items-center justify-center rounded hover:bg-accent transition-colors cursor-pointer"
          onClick={(e: React.MouseEvent) => { e.stopPropagation(); row.toggleExpanded(); }}
          aria-label={row.getIsExpanded() ? "Collapse" : "Expand"}
        >
          {row.getIsExpanded() ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      )}
      {selectionEnabled && (
        <Checkbox
          size={checkboxSize}
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onCheckedChange={(v: boolean) => row.toggleSelected(v)}
          aria-label="Select row"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        />
      )}
    </div>
  ),
  enableSorting: false,
  enableGlobalFilter: false,
  enableColumnFilter: false,
  enableHiding: false,
});
