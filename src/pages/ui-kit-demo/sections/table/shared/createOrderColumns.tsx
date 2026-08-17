import { createColumnHelper, type DateRange } from "@shared/ui";
import type { FilterFn } from "@tanstack/react-table";

import type { Order } from "./order.types";
import { formatCurrency, formatDate } from "./order-table.meta";
import { RightAlign } from "./RightAlign";
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
 * Column set shared by every Table example — keeps every demo visually and
 * structurally consistent so the differences between them come only from
 * the feature being demonstrated, not from re-modeled columns.
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
    header: () => <RightAlign>Позиций</RightAlign>,
    size: 100,
    aggregationFn: "sum",
    cell: ({ getValue }) => <RightAlign>{getValue()}</RightAlign>,
    aggregatedCell: ({ getValue }) => (
      <RightAlign>Σ {getValue<number>()}</RightAlign>
    ),
  }),
  orderHelper.accessor("amount", {
    header: () => <RightAlign>Сумма</RightAlign>,
    size: 130,
    aggregationFn: "sum",
    cell: ({ row }) => (
      <RightAlign>
        <span className="font-medium">
          {formatCurrency(row.original.amount)}
        </span>
      </RightAlign>
    ),
    aggregatedCell: ({ getValue }) => (
      <RightAlign>
        <span className="font-medium">
          Σ {formatCurrency(getValue<number>())}
        </span>
      </RightAlign>
    ),
    footer: ({ table }) => {
      const total = table
        .getRowModel()
        .rows.reduce((sum, row) => sum + row.original.amount, 0);

      return <RightAlign>Σ {formatCurrency(total)}</RightAlign>;
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
