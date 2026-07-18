import { Input, Table } from "@components/ui";
import { Search } from "lucide-react";
import type { ChangeEvent, FC } from "react";
import { useCallback } from "react";

import { ExampleCard } from "../../shared";
import { useCombinedExample } from "./useCombinedExample";

export const CombinedExample: FC = () => {
  const { data, columns, features, search, onSearchChange } =
    useCombinedExample();

  const handleSearchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value),
    [onSearchChange],
  );

  return (
    <ExampleCard
      title="Комбинация фич"
      description="Поиск + сортировка + выбор строк + resize + pinning + пагинация — всё вместе, как на реальном экране."
    >
      <Input
        className="max-w-xs"
        placeholder="Поиск по клиенту, статусу…"
        value={search}
        onChange={handleSearchChange}
        onClear={() => onSearchChange("")}
        clearable
        size="sm"
        leftIcon={<Search className="h-4 w-4" />}
      />
      <Table
        data={data}
        columns={columns}
        size="sm"
        features={features}
        showColumnVisibility
      />
    </ExampleCard>
  );
};
