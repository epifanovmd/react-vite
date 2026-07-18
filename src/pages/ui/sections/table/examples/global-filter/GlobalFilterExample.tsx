import { Input, Table } from "@components/ui";
import { Search } from "lucide-react";
import type { ChangeEvent, FC } from "react";
import { useCallback } from "react";

import { ExampleCard } from "../../shared";
import { useGlobalFilterExample } from "./useGlobalFilterExample";

export const GlobalFilterExample: FC = () => {
  const { data, columns, features, search, onSearchChange } =
    useGlobalFilterExample();

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value),
    [onSearchChange],
  );

  return (
    <ExampleCard
      title="Глобальный поиск"
      description="useGlobalFilterFeature — один поисковый инпут фильтрует по всем колонкам сразу."
    >
      <Input
        className="max-w-xs"
        placeholder="Поиск по клиенту, статусу…"
        value={search}
        onChange={handleChange}
        onClear={() => onSearchChange("")}
        clearable
        size="sm"
        leftIcon={<Search className="h-4 w-4" />}
      />
      <Table data={data} columns={columns} size="sm" features={features} />
    </ExampleCard>
  );
};
