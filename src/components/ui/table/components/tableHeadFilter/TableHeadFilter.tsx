import type { Column } from "@tanstack/react-table";
import { Filter } from "lucide-react";
import { useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "../../../popover";
import type { ColumnFilterConfig } from "./filterRegistry";
import { FILTER_CONTROLS } from "./filterRegistry";

interface TableHeadFilterProps<TData> {
  column: Column<TData, unknown>;
}

const isFilterActive = (value: unknown): boolean => {
  if (value == null) return false;
  if (Array.isArray(value)) return value.length > 0;

  return String(value).trim().length > 0;
};

export const TableHeadFilter = <TData,>({
  column,
}: TableHeadFilterProps<TData>) => {
  const [open, setOpen] = useState(false);
  const config = column.columnDef.meta?.filter as
    ColumnFilterConfig | undefined;

  if (!config) return null;

  const active = isFilterActive(column.getFilterValue());
  const Control = FILTER_CONTROLS[config.type];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Фильтр колонки"
          className="relative inline-flex h-5 w-5 cursor-pointer items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          onClick={e => e.stopPropagation()}
        >
          <Filter
            className={`h-3.5 w-3.5 transition-opacity ${!active ? "opacity-40" : ""}`}
          />
          {active && (
            <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-auto min-w-56 max-w-xs p-3">
        <Control config={config} column={column} />
      </PopoverContent>
    </Popover>
  );
};
