import {
  Badge,
  Button,
  type ColumnDef,
  type ColumnFilterOption,
} from "@components/ui";
import { Eye } from "lucide-react";
import type { ReactNode } from "react";

import type { Order, OrderStatus } from "./table.types";

/* eslint-disable react-refresh/only-export-components */

/**
 * Определения колонок таблицы заказов.
 *
 * Чистый презентационный слой: зависит только от доменного типа `Order` и
 * UI-кита. Колонки строятся фабрикой, чтобы инжектить колбэк просмотра
 * строки (Dependency Inversion) — вместо того, чтобы тянуть view-model
 * внутрь ячеек.
 */

const STATUS_META: Record<
  OrderStatus,
  { label: string; variant: "success" | "warning" | "destructive" | "info" }
> = {
  paid: { label: "Оплачен", variant: "success" },
  pending: { label: "В ожидании", variant: "warning" },
  failed: { label: "Ошибка", variant: "destructive" },
  refunded: { label: "Возврат", variant: "info" },
};

/** Опции фильтра по статусу (multiselect в хидере колонки). */
const STATUS_FILTER_OPTIONS: ColumnFilterOption[] = (
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

/** Форматирует сумму из центов в валютную строку. */
export const formatCurrency = (cents: number, currency = "USD"): string => {
  if (currency === "USD") return CURRENCY_FORMATTER.format(cents / 100);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(cents / 100);
};

/** Форматирует ISO-дату в человекочитаемый вид. */
export const formatDate = (iso: string): string =>
  DATE_FORMATTER.format(new Date(iso));

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

export interface OrderColumnsOptions {
  /** Колбэк открытия деталей строки (drawer). */
  onView: (order: Order) => void;
}

/**
 * Создаёт массив колонок. Фабрика, а не статичный массив, чтобы пробросить
 * `onView` без протечки view-model в презентационный слой.
 */
export const createOrderColumns = ({
  onView,
}: OrderColumnsOptions): ColumnDef<Order>[] => [
  {
    accessorKey: "id",
    header: "ID",
    enableSorting: false,
    cell: ({ getValue }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "customer",
    header: "Клиент",
    filterFn: "includesString",
    meta: { filter: { type: "text", placeholder: "Поиск по клиенту…" } },
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.customer}</span>
        <span className="text-xs text-muted-foreground">
          {row.original.email}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Статус",
    size: 130,
    enableSorting: false,
    filterFn: "arrIncludesSome",
    meta: {
      filter: { type: "multiselect", options: STATUS_FILTER_OPTIONS },
    },
    cell: ({ getValue }) => <StatusBadge status={getValue<OrderStatus>()} />,
  },
  {
    accessorKey: "items",
    header: () => <RightAlign>Позиций</RightAlign>,
    size: 110,
    cell: ({ getValue }) => <RightAlign>{getValue<number>()}</RightAlign>,
  },
  {
    accessorKey: "amount",
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
  },
  {
    accessorKey: "createdAt",
    header: "Создан",
    size: 130,
    cell: ({ getValue }) => (
      <span className="tabular-nums text-muted-foreground">
        {formatDate(getValue<string>())}
      </span>
    ),
  },
  {
    id: "actions",
    header: "",
    size: 64,
    enableSorting: false,
    enableGlobalFilter: false,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          aria-label={`Просмотр заказа ${row.original.id}`}
          onClick={e => {
            e.stopPropagation();
            onView(row.original);
          }}
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
