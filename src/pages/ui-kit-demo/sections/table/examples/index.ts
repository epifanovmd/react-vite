import type { FC } from "react";

import { BasicExample } from "./basic";
import { BulkActionsExample } from "./bulk-actions";
import { ColumnFiltersExample } from "./column-filters";
import { ColumnOrderExample } from "./column-order";
import { ColumnPinningExample } from "./column-pinning";
import { ColumnResizingExample } from "./column-resizing";
import { ColumnVisibilityExample } from "./column-visibility";
import { CombinedExample } from "./combined";
import { DisplayOptionsExample } from "./display-options";
import { ExpandingExample } from "./expanding";
import { GlobalFilterExample } from "./global-filter";
import { GroupingExample } from "./grouping";
import { InfiniteScrollExample } from "./infinite-scroll";
import { PaginationExample } from "./pagination";
import { PersistedSettingsExample } from "./persisted-settings";
import { RowClickExample } from "./row-click";
import { RowSelectionExample } from "./row-selection";
import { SortingExample } from "./sorting";
import { StickyExample } from "./sticky";
import { VirtualExample } from "./virtual";

export interface TableExample {
  value: string;
  label: string;
  Component: FC;
}

/** Вкладка на каждый сценарий Table; все примеры используют общие данные и колонки (см. `../shared`). */
export const TABLE_EXAMPLES: TableExample[] = [
  { value: "basic", label: "Базовый", Component: BasicExample },
  { value: "sorting", label: "Сортировка", Component: SortingExample },
  {
    value: "global-filter",
    label: "Глобальный поиск",
    Component: GlobalFilterExample,
  },
  {
    value: "column-filters",
    label: "Фильтры колонок",
    Component: ColumnFiltersExample,
  },
  {
    value: "row-selection",
    label: "Выбор строк",
    Component: RowSelectionExample,
  },
  {
    value: "bulk-actions",
    label: "Массовые действия",
    Component: BulkActionsExample,
  },
  { value: "pagination", label: "Пагинация", Component: PaginationExample },
  {
    value: "infinite-scroll",
    label: "Бесконечная прокрутка",
    Component: InfiniteScrollExample,
  },
  {
    value: "column-visibility",
    label: "Видимость колонок",
    Component: ColumnVisibilityExample,
  },
  {
    value: "column-order",
    label: "Порядок колонок",
    Component: ColumnOrderExample,
  },
  {
    value: "column-pinning",
    label: "Закрепление колонок",
    Component: ColumnPinningExample,
  },
  {
    value: "column-resizing",
    label: "Ширина колонок",
    Component: ColumnResizingExample,
  },
  {
    value: "persisted-settings",
    label: "Сохранение настроек",
    Component: PersistedSettingsExample,
  },
  {
    value: "expanding",
    label: "Разворачивание строк",
    Component: ExpandingExample,
  },
  { value: "grouping", label: "Группировка", Component: GroupingExample },
  {
    value: "sticky",
    label: "Липкие шапка и подвал",
    Component: StickyExample,
  },
  { value: "virtual", label: "Виртуализация", Component: VirtualExample },
  {
    value: "display-options",
    label: "Внешний вид",
    Component: DisplayOptionsExample,
  },
  { value: "row-click", label: "Клик по строке", Component: RowClickExample },
  { value: "combined", label: "Комбинация фич", Component: CombinedExample },
];
