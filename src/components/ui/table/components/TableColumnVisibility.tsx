import type { Table as TanstackTable } from "@tanstack/react-table";
import { Columns } from "lucide-react";

import { Checkbox } from "../../checkbox";
import { IconButton } from "../../icon-button";
import { Popover, PopoverContent, PopoverTrigger } from "../../popover";

interface TableColumnVisibilityProps<TData> {
  table: TanstackTable<TData>;
}

export const TableColumnVisibility = <TData,>({
  table,
}: TableColumnVisibilityProps<TData>) => {
  const allColumns = table.getAllLeafColumns();
  const hideableColumns = allColumns.filter(col => col.getCanHide());
  const allVisible = table.getIsAllColumnsVisible();
  const someVisible = table.getIsSomeColumnsVisible();

  if (hideableColumns.length === 0) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <IconButton
          aria-label="Toggle column visibility"
          className="border border-input bg-background shadow-sm"
        >
          <Columns className="h-4 w-4" />
        </IconButton>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-56 p-3">
        <div className="space-y-1">
          <label className="flex items-center gap-2 rounded px-1 py-1.5 hover:bg-accent/50 cursor-pointer border-b border-border pb-2 mb-1">
            <Checkbox
              size="sm"
              checked={allVisible}
              indeterminate={!allVisible && someVisible}
              onCheckedChange={() => table.toggleAllColumnsVisible()}
              aria-label="Toggle all columns"
            />
            <span className="text-sm font-medium">Все колонки</span>
          </label>

          {hideableColumns.map(column => {
            const label =
              (column.columnDef.header as React.ReactNode) ?? column.id;

            return (
              <label
                key={column.id}
                className="flex items-center gap-2 rounded px-1 py-1.5 hover:bg-accent/50 cursor-pointer transition-colors"
              >
                <Checkbox
                  size="sm"
                  checked={column.getIsVisible()}
                  onCheckedChange={v => column.toggleVisibility(!!v)}
                  aria-label={`Toggle ${column.id}`}
                />
                <span className="text-sm truncate">
                  {typeof label === "string" ? label : column.id}
                </span>
              </label>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};
