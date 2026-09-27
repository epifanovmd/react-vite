import { Input, Table } from "@shared/ui";
import { Search } from "lucide-react";
import type { ChangeEvent, FC } from "react";
import { useCallback } from "react";

import { ExampleCard } from "../../shared";
import { useCombinedExample } from "./useCombinedExample";

const SEARCH_ICON = <Search className="h-4 w-4" />;

export const CombinedExample: FC = () => {
  const { data, columns, features, search, onSearchChange } =
    useCombinedExample();

  const handleSearchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value),
    [onSearchChange],
  );

  const handleClear = useCallback(() => onSearchChange(""), [onSearchChange]);

  return (
    <ExampleCard
      title="Комбинация фич"
      description="Поиск в toolbar-слоте + сортировка + выбор строк + resize + pinning + пагинация — всё вместе, как на реальном экране."
    >
      <Table
        data={data}
        columns={columns}
        size="sm"
        features={features}
        showColumnVisibility
        toolbar={
          <Input
            className="max-w-xs"
            placeholder="Поиск по клиенту, статусу…"
            value={search}
            onChange={handleSearchChange}
            onClear={handleClear}
            clearable
            size="sm"
            leftIcon={SEARCH_ICON}
          />
        }
      />
    </ExampleCard>
  );
};
