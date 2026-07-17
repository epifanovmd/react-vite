import { Card, Input, Table } from "@components/ui";
import { Search } from "lucide-react";
import { observer } from "mobx-react-lite";
import { type ChangeEvent, type FC, useCallback } from "react";

import { useClientDemo } from "./useClientDemo";

export interface ClientTabProps {
  density: "sm" | "md" | "lg";
  variant: "default" | "striped" | "bordered";
  sticky: boolean;
  resizable: boolean;
}

export const ClientTab: FC<ClientTabProps> = observer(
  ({ density, variant, sticky, resizable }) => {
    const vm = useClientDemo({ resizable });
    const { onSearchChange } = vm;

    const handleSearchChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value),
      [onSearchChange],
    );

    return (
      <Card
        className="flex flex-1 flex-col overflow-hidden"
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
            size={density}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>

        <Table
          data={vm.orders}
          columns={vm.columns}
          size={density}
          variant={variant}
          stickyHeader={sticky}
          features={vm.features}
          rowClassName={vm.rowClassName}
          getRowId={vm.getRowId}
          showColumnVisibility
        />
      </Card>
    );
  },
);
