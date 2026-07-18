import type { Table as TanstackTable } from "@tanstack/react-table";
import { cn } from "@utils/cn";
import { ArrowLeftToLine, ArrowRightToLine, Columns } from "lucide-react";

import { Checkbox } from "../../checkbox";
import { IconButton } from "../../icon-button";
import { Popover, PopoverContent, PopoverTrigger } from "../../popover";

interface TableColumnVisibilityProps<TData> {
  table: TanstackTable<TData>;
  pinningEnabled?: boolean;
}

const pinButtonClass =
  "inline-flex h-5 w-5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground";

export const TableColumnVisibility = <TData,>({
  table,
  pinningEnabled,
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

      <PopoverContent align="end" className="w-64 p-3">
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
            const pinned = column.getIsPinned();

            return (
              <div
                key={column.id}
                className="flex items-center gap-2 rounded px-1 py-1.5 hover:bg-accent/50 transition-colors"
              >
                <label className="flex flex-1 items-center gap-2 cursor-pointer overflow-hidden">
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

                {pinningEnabled && column.getCanPin() && (
                  <div className="flex shrink-0 items-center gap-0.5">
                    <button
                      type="button"
                      aria-label="Закрепить слева"
                      className={cn(pinButtonClass, pinned === "left" && "text-primary")}
                      onClick={() => column.pin(pinned === "left" ? false : "left")}
                    >
                      <ArrowLeftToLine className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Закрепить справа"
                      className={cn(pinButtonClass, pinned === "right" && "text-primary")}
                      onClick={() => column.pin(pinned === "right" ? false : "right")}
                    >
                      <ArrowRightToLine className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};
