import { type Column } from "@tanstack/react-table";
import { Filter, Search } from "lucide-react";
import * as React from "react";

import { Input } from "../../input";
import { Popover, PopoverContent, PopoverTrigger } from "../../popover";
import { Select } from "../../select";
import type { ColumnFilterConfig } from "../Table.types";

const TEXT_DEBOUNCE_MS = 200;

interface TableHeadFilterProps<TData> {
  column: Column<TData, unknown>;
}

/** Активен ли фильтр по значению (для индикатора-точки на триггере). */
const isFilterActive = (value: unknown): boolean => {
  if (value == null) return false;

  if (Array.isArray(value)) return value.length > 0;

  return String(value).trim().length > 0;
};

/**
 * Поповер фильтра колонки. Триггер — иконка-воронка справа от заголовка/сорта.
 *
 * Режимы:
 * - server (`manualFiltering`): `column.setFilterValue` лишь обновляет
 *   `columnFilters`, который родитель отправляет на сервер.
 * - client (по умолчанию): TanStack применяет фильтр через `filterFn` колонки.
 *
 * Текстовый инпут имеет локальный стейт + дебаунс, чтобы не дёргать сервер
 * (и не спамить перерисовками в client-режиме) на каждое нажатие.
 */
export const TableHeadFilter = <TData,>({
  column,
}: TableHeadFilterProps<TData>) => {
  const [open, setOpen] = React.useState(false);

  const config = column.columnDef.meta?.filter;

  // Рендерим только при наличии meta.filter (см. TableHeadCell), но TS это
  // неизвестно — страхуемся.
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

// ─── Контролы по типу ────────────────────────────────────────────────────────

interface FilterControlProps<TData> {
  config: ColumnFilterConfig;

  column: Column<TData, unknown>;
}

const FilterControl = <TData,>({
  config,
  column,
}: FilterControlProps<TData>) => {
  if (config.type === "text") {
    return <TextControl column={column} placeholder={config.placeholder} />;
  }

  if (config.type === "select") {
    return (
      <Select
        clearable
        size="sm"
        search
        placeholder={config.placeholder ?? "Все"}
        options={config.options}
        value={(column.getFilterValue() as string | null | undefined) ?? null}
        onChange={(v: string | null) => column.setFilterValue(v)}
      />
    );
  }

  return (
    <Select
      multi
      size="sm"
      search
      placeholder="Все"
      options={config.options}
      value={(column.getFilterValue() as string[] | undefined) ?? []}
      onChange={(v: string[]) => column.setFilterValue(v)}
    />
  );
};

// ─── Text: локальный стейт + дебаунс ─────────────────────────────────────────

interface TextControlProps<TData> {
  column: Column<TData, unknown>;

  placeholder?: string;
}

const TextControl = <TData,>({
  column,
  placeholder,
}: TextControlProps<TData>) => {
  const [value, setValue] = React.useState(
    () => (column.getFilterValue() as string | undefined) ?? "",
  );

  // Пропускаем первый запуск, чтобы открытие поповера не вызывало перезапрос.
  const isFirstRun = React.useRef(true);

  React.useEffect(() => {
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
