import {
  Button,
  Card,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  Empty,
  Input,
  Table,
} from "@components/ui";
import { RefreshCw, Search } from "lucide-react";
import { observer } from "mobx-react-lite";
import { type ChangeEvent, type FC, useCallback } from "react";

import { formatCurrency, formatDate } from "../table.columns";
import type { Order } from "../table.types";
import { useServerDemo } from "./useServerDemo";

export interface ServerTabProps {
  density: "sm" | "md" | "lg";
  variant: "default" | "striped" | "bordered";
  sticky: boolean;
}

export const ServerTab: FC<ServerTabProps> = observer(
  ({ density, variant, sticky }) => {
    const vm = useServerDemo();
    const { onSearchInputChange } = vm;

    const handleSearchChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => onSearchInputChange(e.target.value),
      [onSearchInputChange],
    );

    return (
      <Card
        className="flex flex-1 flex-col overflow-hidden"
        contentClassName="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden p-6 pt-0"
      >
        <div className="flex flex-wrap items-center gap-2">
          <Input
            className="max-w-xs"
            placeholder="Поиск по клиенту, email, id, статусу…"
            value={vm.searchInput}
            onChange={handleSearchChange}
            onClear={vm.onClearSearch}
            clearable
            size={density}
            leftIcon={<Search className="h-4 w-4" />}
            loading={vm.isBusy}
          />
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size={density}
              onClick={() => vm.reload()}
              loading={vm.isBusy}
              leftIcon={<RefreshCw className="h-4 w-4" />}
            >
              Обновить
            </Button>
          </div>

          {vm.isError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm">
              Не удалось загрузить заказы:{" "}
              {vm.error?.message ?? "неизвестная ошибка"}
              <Button
                variant="outline"
                size="sm"
                className="ml-3"
                onClick={() => vm.reload()}
              >
                Повторить
              </Button>
            </div>
          )}
        </div>

        <Table
          data={vm.orders}
          columns={vm.columns}
          size={density}
          variant={variant}
          stickyHeader={sticky}
          features={vm.features}
          onRowClick={vm.onRowClick}
          getRowId={vm.getRowId}
          loading={vm.isLoading}
          refreshing={vm.isRefreshing}
          empty={
            <Empty
              icon="search"
              title="Заказы не найдены"
              description={
                vm.search
                  ? `Ничего не найдено по запросу «${vm.search}».`
                  : "Нет данных для отображения."
              }
              action={
                <Button variant="outline" size="sm" onClick={vm.onClearSearch}>
                  Сбросить поиск
                </Button>
              }
            />
          }
          showColumnVisibility
        />

        <Drawer
          open={!!vm.activeOrder}
          onOpenChange={open => {
            if (!open) vm.closeDetails();
          }}
        >
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Заказ {vm.activeOrder?.id}</DrawerTitle>
              <DrawerDescription>
                Подробная информация о заказе
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4 pb-2">
              {vm.activeOrder && <OrderDetails order={vm.activeOrder} />}
            </div>
            <DrawerFooter>
              <Button onClick={vm.closeDetails}>Закрыть</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Card>
    );
  },
);

const OrderDetails = ({ order }: { order: Order }) => (
  <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
    {[
      { label: "Клиент", value: order.customer },
      { label: "Email", value: order.email },
      { label: "Статус", value: order.status },
      { label: "Сумма", value: formatCurrency(order.amount, order.currency) },
      { label: "Позиций", value: String(order.items) },
      { label: "Создан", value: formatDate(order.createdAt) },
    ].map(row => (
      <div key={row.label} className="rounded-lg border bg-muted/30 px-3 py-2">
        <dt className="text-xs text-muted-foreground">{row.label}</dt>
        <dd className="text-sm font-medium">{row.value}</dd>
      </div>
    ))}
  </dl>
);
