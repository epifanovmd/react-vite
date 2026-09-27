export type OrderStatus = "paid" | "pending" | "failed" | "refunded";

export interface Order {
  id: string;
  customer: string;
  email: string;
  status: OrderStatus;
  amount: number;
  items: number;
  createdAt: string;
}
