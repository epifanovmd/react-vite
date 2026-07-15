import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  Empty,
  Input,
  Segmented,
  Table,
  type TableProps,
} from "@components/ui";
import { Pin, PinOff, RefreshCw, Search, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { type ChangeEvent, FC, useCallback, useMemo, useState } from "react";

import type { Order } from "./table.types";
import { createOrderColumns, formatCurrency, formatDate } from "./tableColumns";
import { useTableDemo } from "./useTableDemo";

type Density = "sm" | "md" | "lg";

type Variant = NonNullable<TableProps<Order>["variant"]>;

const DENSITY_OPTIONS = [
  { label: "S", value: "sm" },
  { label: "M", value: "md" },
  { label: "L", value: "lg" },
];

const VARIANT_OPTIONS = [
  { label: "Default", value: "default" },
  { label: "Striped", value: "striped" },
  { label: "Border", value: "bordered" },
];

const PAGE_SIZE_OPTIONS = [10, 20, 50];

const TablePage: FC = observer(() => {
  const vm = useTableDemo();

  // Деструктурируем стабильные колбэки, чтобы useCallback/useMemo
  // корректно отслеживали зависимости (react-hooks/exhaustive-deps).
  const { openDetails, onSearchInputChange } = vm;

  const [density, setDensity] = useState<Density>("md");

  const [variant, setVariant] = useState<Variant>("default");

  const [sticky, setSticky] = useState(true);

  const columns = useMemo(
    () => createOrderColumns({ onView: openDetails }),
    [openDetails],
  );

  const handleSearchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => onSearchInputChange(e.target.value),
    [onSearchInputChange],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 p-4 md:p-6 max-h-full h-full">
      <div className="shrink-0 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Заказы</h1>
        <p className="text-sm text-muted-foreground">
          Демонстрация всех возможностей Table: серверная пагинация, ручная
          сортировка, поиск, выбор строк, footer-агрегация, состояния
          загрузки/ошибки и детализация строки.
        </p>
      </div>

      <Card
        className="flex min-h-0 flex-1 flex-col h-full"
        title={<CardTitle className="text-base">Таблица заказов</CardTitle>}
        description={
          <CardDescription className="text-xs">
            Источник данных — mock-API через PagedHolder (usePaged)
          </CardDescription>
        }
        contentClassName="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden p-6 pt-0 h-0"
      >
        {/* Toolbar: поиск, плотность, вариант, sticky, обновление */}
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

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Segmented
              size="sm"
              options={DENSITY_OPTIONS}
              value={density}
              onChange={value => setDensity(value as Density)}
            />

            <Segmented
              size="sm"
              options={VARIANT_OPTIONS}
              value={variant}
              onChange={value => setVariant(value as Variant)}
            />

            <Button
              variant={sticky ? "secondary" : "outline"}
              size="sm"
              aria-pressed={sticky}
              onClick={() => setSticky(prev => !prev)}
              leftIcon={
                sticky ? (
                  <Pin className="h-4 w-4" />
                ) : (
                  <PinOff className="h-4 w-4" />
                )
              }
            >
              Sticky
            </Button>

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

        {/* Bulk-действия над выбранными строками */}
        {vm.selectedOrders.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
            <Badge variant="primary">Выбрано: {vm.selectedOrders.length}</Badge>

            <span className="truncate text-xs text-muted-foreground">
              {vm.selectedOrders.map(order => order.id).join(", ")}
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

        {/* Ошибка загрузки */}
        {vm.isError && (
          <Alert variant="error">
            <div className="flex flex-1 items-center justify-between gap-3">
              <span className="text-sm">
                Не удалось загрузить заказы:{" "}
                {vm.error?.message ?? "неизвестная ошибка"}
              </span>

              <Button variant="outline" size="sm" onClick={() => vm.reload()}>
                Повторить
              </Button>
            </div>
          </Alert>
        )}

        {/* Таблица: задействованы все возможности компонента */}
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
                vm.search ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={vm.onClearSearch}
                  >
                    Сбросить поиск
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => vm.reload()}
                  >
                    Обновить
                  </Button>
                )
              }
            />
          }
        >
          <Table.Pagination
            totalPages={vm.pageCount}
            currentPage={vm.currentPage}
            pageSize={vm.pageSize}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            onPageChange={vm.goToPage}
            onPageSizeChange={vm.setPageSize}
          />
        </Table>
      </Card>

      {/* Детализация выбранной строки */}
      <Drawer
        open={!!vm.activeOrder}
        onOpenChange={open => {
          if (!open) vm.closeDetails();
        }}
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Заказ {vm.activeOrder?.id}</DrawerTitle>

            <DrawerDescription>Подробная информация о заказе</DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-2">
            <OrderDetails order={vm.activeOrder} />
          </div>

          <DrawerFooter>
            <Button onClick={vm.closeDetails}>Закрыть</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
});

const OrderDetails = ({ order }: { order: Order | null }) => {
  if (!order) return null;

  const rows: Array<{ label: string; value: string }> = [
    { label: "Клиент", value: order.customer },
    { label: "Email", value: order.email },
    { label: "Статус", value: order.status },
    {
      label: "Сумма",
      value: formatCurrency(order.amount, order.currency),
    },
    { label: "Позиций", value: String(order.items) },
    { label: "Создан", value: formatDate(order.createdAt) },
  ];

  return (
    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {rows.map(row => (
        <div
          key={row.label}
          className="rounded-lg border bg-muted/30 px-3 py-2"
        >
          <dt className="text-xs text-muted-foreground">{row.label}</dt>

          <dd className="text-sm font-medium">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
};

export default TablePage;
