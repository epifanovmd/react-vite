import {
  Badge,
  Button,
  type ColumnDef,
  type ColumnFilterOption,
} from "@components/ui";
import { Eye } from "lucide-react";
import type { ReactNode } from "react";

import type { Invoice, Order, OrderStatus } from "./table.types";

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
  onView: (order: Order) => void;
}

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
    meta: { filter: { type: "multiselect", options: STATUS_FILTER_OPTIONS } },
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

export const createClientOrderColumns = (): ColumnDef<Order>[] => [
  {
    accessorKey: "id",
    header: "ID",
    enableSorting: true,
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
    meta: { filter: { type: "text", placeholder: "Поиск…" } },
    size: 200,
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
    enableSorting: true,
    filterFn: "arrIncludesSome",
    meta: { filter: { type: "multiselect", options: STATUS_FILTER_OPTIONS } },
    cell: ({ getValue }) => <StatusBadge status={getValue<OrderStatus>()} />,
  },
  {
    accessorKey: "items",
    header: "Позиций",
    size: 110,
    cell: ({ getValue }) => <RightAlign>{getValue<number>()}</RightAlign>,
  },
  {
    accessorKey: "amount",
    header: "Сумма",
    size: 130,
    cell: ({ row }) => (
      <RightAlign>
        <span className="font-medium">
          {formatCurrency(row.original.amount, row.original.currency)}
        </span>
      </RightAlign>
    ),
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
];

export const createInvoiceColumns = (): ColumnDef<Invoice>[] => [
  {
    accessorKey: "id",
    header: "Счёт",
    enableSorting: true,
    size: 120,
    cell: ({ getValue }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "customer",
    header: "Клиент",
    enableSorting: true,
    cell: ({ getValue }) => (
      <span className="font-medium">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "date",
    header: "Дата",
    size: 130,
    cell: ({ getValue }) => (
      <span className="tabular-nums text-muted-foreground">
        {formatDate(getValue<string>())}
      </span>
    ),
  },
  {
    accessorKey: "total",
    header: "Сумма",
    size: 130,
    cell: ({ getValue }) => (
      <RightAlign>
        <span className="font-medium">
          {formatCurrency(getValue<number>())}
        </span>
      </RightAlign>
    ),
  },
  {
    accessorKey: "status",
    header: "Статус",
    size: 130,
    cell: ({ getValue }) => <StatusBadge status={getValue<OrderStatus>()} />,
  },
];
