import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  Input,
  Table,
} from "@components/ui";
import { Search, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { type ChangeEvent, type FC, useCallback, useMemo } from "react";

import { createClientOrderColumns } from "../tableColumns";
import { useClientDemo } from "./useClientDemo";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export interface ClientTabProps {
  density: "sm" | "md" | "lg";
  variant: "default" | "striped" | "bordered";
  sticky: boolean;
  resizable: boolean;
}

export const ClientTab: FC<ClientTabProps> = observer(
  ({ density, variant, sticky, resizable }) => {
    const vm = useClientDemo();
    const { onSearchChange } = vm;
    const columns = useMemo(() => createClientOrderColumns(), []);

    const handleSearchChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value),
      [onSearchChange],
    );

    const rowClassName = useCallback(
      (order: { status: string }) =>
        order.status === "failed"
          ? "bg-destructive/5 [&_td]:border-destructive/20"
          : order.status === "paid"
            ? "bg-success/5"
            : "",
      [],
    );

    return (
      <Card
        className="flex flex-1 flex-col overflow-hidden"
        title={
          <CardTitle className="text-base">
            Клиентская таблица (500 записей)
          </CardTitle>
        }
        description={
          <CardDescription className="text-xs">
            Client-side пагинация (TanStack), ресайз колонок, column visibility,
            rowClassName (подсветка строк по статусу), multi-select.
          </CardDescription>
        }
        contentClassName="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden p-6 pt-0"
      >
        <div className="flex flex-wrap items-center gap-2">
          <Input
            className="max-w-xs"
            placeholder="Поиск по клиенту, email, id…"
            value={vm.search}
            onChange={handleSearchChange}
            onClear={() => vm.onSearchChange("")}
            clearable
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>

        {vm.selectedOrders.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
            <Badge variant="primary">Выбрано: {vm.selectedOrders.length}</Badge>
            <span className="truncate text-xs text-muted-foreground">
              {vm.selectedOrders.map(o => o.id).join(", ")}
            </span>
            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => vm.onRowSelectionChange({})}
              >
                Сбросить
              </Button>
            </div>
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
          pagination={{ pageSize: 10 }}
          selection="multi"
          rowSelection={vm.rowSelection}
          onRowSelectionChange={vm.onRowSelectionChange}
          onSelectedRowsChange={vm.onSelectedRowsChange}
          columnFilters={vm.columnFilters}
          onColumnFiltersChange={vm.onColumnFiltersChange}
          resizable={resizable}
          rowClassName={rowClassName}
          getRowId={order => order.id}
        >
          <Table.ColumnVisibility />
          <Table.Pagination pageSizeOptions={PAGE_SIZE_OPTIONS} />
        </Table>
      </Card>
    );
  },
);
