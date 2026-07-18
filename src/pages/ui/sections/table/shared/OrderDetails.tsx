import type { FC } from "react";

import { formatCurrency, formatDate } from "./order.columns";
import type { Order } from "./order.types";

interface OrderDetailsProps {
  order: Order;
}

export const OrderDetails: FC<OrderDetailsProps> = ({ order }) => (
  <dl className="grid grid-cols-2 gap-3 bg-muted/30 p-4 sm:grid-cols-4">
    {[
      { label: "Клиент", value: order.customer },
      { label: "Email", value: order.email },
      { label: "Позиций", value: String(order.items) },
      { label: "Сумма", value: formatCurrency(order.amount) },
      { label: "Создан", value: formatDate(order.createdAt) },
    ].map(row => (
      <div key={row.label}>
        <dt className="text-xs text-muted-foreground">{row.label}</dt>
        <dd className="text-sm font-medium">{row.value}</dd>
      </div>
    ))}
  </dl>
);
