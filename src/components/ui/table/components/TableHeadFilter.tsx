import { type Column } from "@tanstack/react-table";
import { Filter, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Input } from "../../input";
import { Popover, PopoverContent, PopoverTrigger } from "../../popover";
import { Select } from "../../select";
import { useAsyncOptions, useStaticOptions } from "../../select/strategies";
import type { ColumnFilterConfig, ColumnFilterOption } from "../Table.types";

const TEXT_DEBOUNCE_MS = 200;

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
  const config = column.columnDef.meta?.filter;

  if (!config) return null;

  const active = isFilterActive(column.getFilterValue());

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

      <PopoverContent align="start" className="w-56 p-3">
        <FilterControl config={config} column={column} />
      </PopoverContent>
    </Popover>
  );
};

interface FilterControlProps<TData> {
  config: ColumnFilterConfig;
  column: Column<TData, unknown>;
}

const FilterControl = <TData,>({
  config,
  column,
}: FilterControlProps<TData>) => {
  if (config.type === "text" && "faceted" in config && config.faceted) {
    return <FacetedControl column={column} />;
  }

  if (config.type === "text") {
    return <TextControl column={column} placeholder={config.placeholder} />;
  }

  if (config.type === "select") {
    return (
      <SelectFilter
        column={column}
        options={config.options}
        placeholder={config.placeholder}
      />
    );
  }

  return <MultiSelectFilter column={column} options={config.options} />;
};

interface SelectFilterProps<TData> {
  column: Column<TData, unknown>;
  options?: ColumnFilterOption[];
  fetchOptions?: (query: string) => Promise<ColumnFilterOption[]>;
  placeholder?: string;
}

const SelectFilter = <TData,>({
  column,
  options,
  fetchOptions,
  placeholder,
}: SelectFilterProps<TData>) => {
  const searchable = useStaticOptions(options ?? [], { search: !fetchOptions });
  const asyncSearchable = useAsyncOptions({
    fetch: async query => {
      if (fetchOptions) {
        return await fetchOptions(query);
      }

      return [];
    },
    getOption: item => item,
    debounce: 300,
    minQueryLength: 2,
    fetchOnMount: true,
  });

  const props = fetchOptions ? asyncSearchable : searchable;

  return (
    <Select
      {...props}
      clearable
      size="sm"
      placeholder={placeholder ?? "Все"}
      value={(column.getFilterValue() as string | null | undefined) ?? null}
      onChange={(v: string | null) => column.setFilterValue(v)}
    />
  );
};

interface MultiSelectFilterProps<TData> {
  column: Column<TData, unknown>;
  options?: ColumnFilterOption[];
  fetchOptions?: (query: string) => Promise<ColumnFilterOption[]>;
}

const MultiSelectFilter = <TData,>({
  column,
  options,
  fetchOptions,
}: MultiSelectFilterProps<TData>) => {
  const searchable = useStaticOptions(options ?? [], { search: !fetchOptions });
  const asyncSearchable = useAsyncOptions({
    fetch: async query => {
      if (fetchOptions) {
        return await fetchOptions(query);
      }

      return [];
    },
    getOption: item => item,
    debounce: 300,
    minQueryLength: 2,
    fetchOnMount: true,
  });

  const props = fetchOptions ? asyncSearchable : searchable;

  return (
    <Select
      {...props}
      multi
      size="sm"
      placeholder="Все"
      value={(column.getFilterValue() as string[] | undefined) ?? []}
      onChange={(v: string[]) => column.setFilterValue(v)}
    />
  );
};

interface TextControlProps<TData> {
  column: Column<TData, unknown>;
  placeholder?: string;
}

const TextControl = <TData,>({
  column,
  placeholder,
}: TextControlProps<TData>) => {
  const [value, setValue] = useState(
    () => (column.getFilterValue() as string | undefined) ?? "",
  );
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;

      return;
    }

    const timer = setTimeout(() => {
      const next = value.trim();

      column.setFilterValue(next.length ? next : undefined);
    }, TEXT_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [value, column]);

  return (
    <Input
      size="sm"
      clearable
      leftIcon={<Search className="h-3.5 w-3.5" />}
      placeholder={placeholder ?? "Поиск…"}
      value={value}
      onChange={e => setValue(e.target.value)}
      onClear={() => setValue("")}
    />
  );
};

interface FacetedControlProps<TData> {
  column: Column<TData, unknown>;
}

const FacetedControl = <TData,>({ column }: FacetedControlProps<TData>) => {
  const uniqueValues = column.getFacetedUniqueValues();
  const currentValue = column.getFilterValue() as string | null | undefined;

  const options = useMemo(() => {
    return Array.from(uniqueValues.entries())
      .filter(([, count]) => count > 0)
      .map(([value]) => ({ value: String(value), label: String(value) }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [uniqueValues]);

  return (
    <Select
      clearable
      size="sm"
      search
      placeholder="Все"
      options={options}
      value={currentValue ?? null}
      onChange={(v: string | null) => column.setFilterValue(v)}
    />
  );
};
