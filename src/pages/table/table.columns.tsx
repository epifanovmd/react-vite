import {
  Badge,
  type ColumnFilterOption,
  createColumnHelper,
  type DateRange,
  type TableFiltersConfig,
} from "@components/ui";
import type { FilterFn } from "@tanstack/react-table";
import type { ReactNode } from "react";

import type { Order, OrderQuery, OrderStatus } from "./table.types";

const orderHelper = createColumnHelper<Order>();

const STATUS_META: Record<
  OrderStatus,
  { label: string; variant: "success" | "warning" | "destructive" | "info" }
> = {
  paid: { label: "Оплачен", variant: "success" },
  pending: { label: "В ожидании", variant: "warning" },
  failed: { label: "Ошибка", variant: "destructive" },
  refunded: { label: "Возврат", variant: "info" },
};

const STATUS_FILTER_OPTIONS: ColumnFilterOption<OrderStatus>[] = (
  Object.keys(STATUS_META) as OrderStatus[]
).map(status => ({ value: status, label: STATUS_META[status].label }));

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const DATE_FORMATTER = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export const formatCurrency = (cents: number, currency = "USD"): string => {
  if (currency === "USD") return CURRENCY_FORMATTER.format(cents / 100);

  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    cents / 100,
  );
};

export const formatDate = (iso: string): string =>
  DATE_FORMATTER.format(new Date(iso));

const dateRangeFilterFn: FilterFn<Order> = (row, columnId, filterValue: DateRange) => {
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

dateRangeFilterFn.autoRemove = (value: DateRange) =>
  !value?.from && !value?.to;

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const meta = STATUS_META[status];

  return (
    <Badge variant={meta.variant} dot>
      {meta.label}
    </Badge>
  );
};

const RightAlign = ({ children }: { children: ReactNode }) => (
  <div className="text-right tabular-nums">{children}</div>
);

export interface ClientOrderFilters {
  customer?: string;
  status?: OrderStatus[];
  createdAt?: DateRange;
}

export const orderFilterFields: TableFiltersConfig<Order, OrderQuery> = {
  customer: {
    queryKey: "customer",
    type: "text",
    placeholder: "Поиск по клиенту…",
  },
  status: {
    queryKey: "statuses",
    type: "multiselect",
    options: STATUS_FILTER_OPTIONS,
  },
  createdAt: {
    queryKey: "createdAt",
    type: "daterange",
    placeholder: "Период создания",
  },
};

export const clientOrderFilterFields: TableFiltersConfig<
  Order,
  ClientOrderFilters
> = {
  customer: { queryKey: "customer", type: "text", placeholder: "Поиск…" },
  status: {
    queryKey: "status",
    type: "multiselect",
    options: STATUS_FILTER_OPTIONS,
  },
  createdAt: {
    queryKey: "createdAt",
    type: "daterange",
    placeholder: "Период создания",
  },
};

export interface CreateOrderColumnsOptions {
  /** Whether `id`/`status` can be sorted — false when only a whitelisted
   * set of fields is sortable server-side. */
  enableSorting?: boolean;
}

export const createOrderColumns = ({
  enableSorting = true,
}: CreateOrderColumnsOptions = {}) => [
  orderHelper.accessor("id", {
    header: "ID",
    enableSorting,
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
    sortingFn: "auto",
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
    enableSorting,
    filterFn: "arrIncludesSome",
    cell: ({ getValue }) => <StatusBadge status={getValue()} />,
  }),
  orderHelper.accessor("items", {
    header: () => <RightAlign>Позиций</RightAlign>,
    size: 110,
    cell: ({ getValue }) => <RightAlign>{getValue()}</RightAlign>,
  }),
  orderHelper.accessor("amount", {
    header: () => <RightAlign>Сумма</RightAlign>,
    size: 130,
    cell: ({ row }) => (
      <RightAlign>
        <span className="font-medium">
          {formatCurrency(row.original.amount, row.original.currency)}
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
