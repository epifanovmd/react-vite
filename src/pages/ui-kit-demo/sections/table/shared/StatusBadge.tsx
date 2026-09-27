import { Badge } from "@shared/ui";
import type { FC } from "react";

import type { OrderStatus } from "./order.types";
import { STATUS_META } from "./order-table.meta";

interface StatusBadgeProps {
  status: OrderStatus;
}

export const StatusBadge: FC<StatusBadgeProps> = ({ status }) => {
  const meta = STATUS_META[status];

  return (
    <Badge variant={meta.variant} dot>
      {meta.label}
    </Badge>
  );
};
