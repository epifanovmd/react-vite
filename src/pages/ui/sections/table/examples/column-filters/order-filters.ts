import type { DateRange, TableFiltersConfig } from "@components/ui";

import {
  type Order,
  type OrderStatus,
  STATUS_FILTER_OPTIONS,
} from "../../shared";

export interface OrderFilters {
  customer?: string;
  status?: OrderStatus[];
  createdAt?: DateRange;
}

export const orderFilterFields: TableFiltersConfig<Order, OrderFilters> = {
  customer: {
    queryKey: "customer",
    type: "text",
    placeholder: "Поиск по клиенту…",
  },
  status: {
    queryKey: "status",
    type: "multiselect",
    options: STATUS_FILTER_OPTIONS,
    faceted: true,
  },
  createdAt: {
    queryKey: "createdAt",
    type: "daterange",
    placeholder: "Период создания",
  },
};
