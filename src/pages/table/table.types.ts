import type { DateRange } from "@components/ui";

export type OrderStatus = "paid" | "pending" | "failed" | "refunded";

export interface Order {
  id: string;
  customer: string;
  email: string;
  status: OrderStatus;
  amount: number;
  currency: string;
  items: number;
  createdAt: string;
}

export type OrderSortField = "customer" | "amount" | "items" | "createdAt";

export type OrderSortDir = "asc" | "desc";

export interface OrderQuery {
  search: string;
  sortBy?: OrderSortField;
  sortDir?: OrderSortDir;
  customer?: string;
  statuses?: OrderStatus[];
  createdAt?: DateRange;
}
