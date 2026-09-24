import type { FC } from "react";

import type { Order } from "./order.types";
import { formatCurrency, formatDate } from "./order-table.meta";

interface OrderDetailsProps {
  order: Order;
}

interface OrderDetailRow {
  label: string;
  value: string;
}

const getOrderDetailRows = (order: Order): OrderDetailRow[] => [
  { label: "Клиент", value: order.customer },
  { label: "Email", value: order.email },
  { label: "Позиций", value: String(order.items) },
  { label: "Сумма", value: formatCurrency(order.amount) },
  { label: "Создан", value: formatDate(order.createdAt) },
];

export const OrderDetails: FC<OrderDetailsProps> = ({ order }) => (
  <dl className="grid grid-cols-2 gap-3 bg-muted/30 p-4 sm:grid-cols-4">
    {getOrderDetailRows(order).map(row => (
      <div key={row.label}>
        <dt className="text-xs text-muted-foreground">{row.label}</dt>
        <dd className="text-sm font-medium">{row.value}</dd>
      </div>
    ))}
  </dl>
);
