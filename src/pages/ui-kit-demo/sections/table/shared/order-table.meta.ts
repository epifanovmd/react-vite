import type { ColumnFilterOption } from "@shared/ui";

import type { OrderStatus } from "./order.types";

export const STATUS_META: Record<
  OrderStatus,
  { label: string; variant: "success" | "warning" | "destructive" | "info" }
> = {
  paid: { label: "Оплачен", variant: "success" },
  pending: { label: "В ожидании", variant: "warning" },
  failed: { label: "Ошибка", variant: "destructive" },
  refunded: { label: "Возврат", variant: "info" },
};

export const STATUS_FILTER_OPTIONS: ColumnFilterOption<OrderStatus>[] = (
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

export const formatCurrency = (cents: number): string =>
  CURRENCY_FORMATTER.format(cents / 100);

export const formatDate = (iso: string): string =>
  DATE_FORMATTER.format(new Date(iso));
