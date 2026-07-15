import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardTitle,
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
import { RefreshCw, Search, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { type ChangeEvent, type FC, useCallback, useMemo } from "react";

import type { Order } from "../table.types";
import {
  createOrderColumns,
  formatCurrency,
  formatDate,
} from "../tableColumns";
import { useServerDemo } from "./useServerDemo";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export interface ServerTabProps {
  density: "sm" | "md" | "lg";
  variant: "default" | "striped" | "bordered";
  sticky: boolean;
}

export const ServerTab: FC<ServerTabProps> = observer(
  ({ density, variant, sticky }) => {
    const vm = useServerDemo();
    const { openDetails, onSearchInputChange } = vm;

    const columns = useMemo(
      () => createOrderColumns({ onView: openDetails }),
      [openDetails],
    );

    const handleSearchChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => onSearchInputChange(e.target.value),
      [onSearchInputChange],
    );

    return (
      <Card
        className="flex flex-1 flex-col overflow-hidden"
        title={<CardTitle className="text-base">Таблица заказов</CardTitle>}
        description={
          <CardDescription className="text-xs">
            Серверная пагинация (usePaged), ручная сортировка, фильтры колонок,
            sticky header, выбор строк, Drawer детализации.
          </CardDescription>
        }
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
            leftIcon={<Search className="h-4 w-4" />}
            loading={vm.isBusy}
          />
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => vm.reload()}
              loading={vm.isBusy}
              leftIcon={<RefreshCw className="h-4 w-4" />}
            >
              Обновить
            </Button>
          </div>
        </div>

        {vm.selectedOrders.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
            <Badge variant="primary">Выбрано: {vm.selectedOrders.length}</Badge>
            <span className="truncate text-xs text-muted-foreground">
              {vm.selectedOrders.map(o => o.id).join(", ")}
            </span>
            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={vm.removeSelected}
                leftIcon={<Trash2 className="h-4 w-4" />}
              >
                Удалить
              </Button>
              <Button variant="ghost" size="sm" onClick={vm.clearSelection}>
                Сбросить
              </Button>
            </div>
          </div>
        )}

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

        <Table
          data={vm.orders}
          columns={columns}
          size={density}
          variant={variant}
          stickyHeader={sticky}
          sorting
          sortingState={vm.sorting}
          onSortingChange={vm.onSortingChange}
          manualSorting
          manualFiltering
          columnFilters={vm.columnFilters}
          onColumnFiltersChange={vm.onColumnFiltersChange}
          globalFilter={vm.search}
          onGlobalFilterChange={vm.onGlobalFilterChange}
          selection
          rowSelection={vm.rowSelection}
          onRowSelectionChange={vm.onRowSelectionChange}
          onSelectedRowsChange={vm.onSelectedRowsChange}
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
        >
          <Table.ColumnVisibility />
          <Table.Pagination
            totalPages={vm.pageCount}
            currentPage={vm.currentPage}
            pageSize={vm.pageSize}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            onPageChange={vm.goToPage}
            onPageSizeChange={vm.setPageSize}
          />
        </Table>

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
