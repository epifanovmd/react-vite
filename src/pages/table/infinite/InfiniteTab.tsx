import { Button, Card, Input, Table } from "@components/ui";
import { RefreshCw, Search } from "lucide-react";
import { observer } from "mobx-react-lite";
import { type ChangeEvent, type FC, useCallback } from "react";

import { useInfiniteDemo } from "./useInfiniteDemo";

export interface InfiniteTabProps {
  density: "sm" | "md" | "lg";
  variant: "default" | "striped" | "bordered";
  sticky: boolean;
}

export const InfiniteTab: FC<InfiniteTabProps> = observer(
  ({ density, variant, sticky }) => {
    const vm = useInfiniteDemo();
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
          />
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size={density}
              onClick={vm.reload}
              loading={vm.isRefreshing}
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
                onClick={vm.reload}
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
          getRowId={vm.getRowId}
          loading={vm.isLoading}
          refreshing={vm.isRefreshing}
          showColumnVisibility
        />
      </Card>
    );
  },
);
