import { createColumnHelper, type DateRange } from "@shared/ui";
import type { FilterFn } from "@tanstack/react-table";

import type { Order } from "./order.types";
import { formatCurrency, formatDate } from "./order-table.meta";
import { StatusBadge } from "./StatusBadge";

const orderHelper = createColumnHelper<Order>();

const dateRangeFilterFn: FilterFn<Order> = (
  row,
  columnId,
  filterValue: DateRange,
) => {
  if (!filterValue?.from && !filterValue?.to) return true;

  const date = new Date(row.getValue<string>(columnId));

  if (filterValue.from && date < filterValue.from) return false;

  if (filterValue.to) {
    const endOfDay = new Date(filterValue.to);

    endOfDay.setHours(23, 59, 59, 999);

    if (date > endOfDay) return false;
  }

  return true;
};

dateRangeFilterFn.autoRemove = (value: DateRange) => !value?.from && !value?.to;

/**
 * Общий набор колонок для всех примеров Table: различия между демо
 * определяются только показываемой фичей, а не перестроенными колонками.
 */
export const createOrderColumns = () => [
  orderHelper.accessor("id", {
    header: "ID",
    cell: ({ getValue }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {getValue()}
      </span>
    ),
  }),
  orderHelper.accessor("customer", {
    header: "Клиент",
    size: 200,
    filterFn: "includesString",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.customer}</span>
        <span className="text-xs text-muted-foreground">
          {row.original.email}
        </span>
      </div>
    ),
  }),
  orderHelper.accessor("status", {
    header: "Статус",
    size: 130,
    filterFn: "arrIncludesSome",
    cell: ({ getValue }) => <StatusBadge status={getValue()} />,
  }),
  orderHelper.accessor("items", {
    header: "Позиций",
    size: 100,
    meta: { align: "right" },
    aggregationFn: "sum",
    cell: ({ getValue }) => getValue(),
    aggregatedCell: ({ getValue }) => `Σ ${getValue<number>()}`,
  }),
  orderHelper.accessor("amount", {
    header: "Сумма",
    size: 130,
    meta: { align: "right" },
    aggregationFn: "sum",
    cell: ({ row }) => (
      <span className="font-medium">{formatCurrency(row.original.amount)}</span>
    ),
    aggregatedCell: ({ getValue }) => (
      <span className="font-medium">
        Σ {formatCurrency(getValue<number>())}
      </span>
    ),
    footer: ({ table }) => {
      const total = table
        .getRowModel()
        .rows.reduce((sum, row) => sum + row.original.amount, 0);

      return `Σ ${formatCurrency(total)}`;
    },
  }),
  orderHelper.accessor("createdAt", {
    header: "Создан",
    size: 130,
    filterFn: dateRangeFilterFn,
    cell: ({ getValue }) => (
      <span className="tabular-nums text-muted-foreground">
        {formatDate(getValue())}
      </span>
    ),
  }),
];
