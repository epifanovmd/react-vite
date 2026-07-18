import { Table } from "@components/ui";
import type { FC } from "react";

import { ExampleCard } from "../../shared";
import { useRowSelectionExample } from "./useRowSelectionExample";

export const RowSelectionExample: FC = () => {
  const { data, columns, features, selectedCount } = useRowSelectionExample();

  return (
    <ExampleCard
      title="Выбор строк"
      description="useRowSelectionFeature — чекбоксы для мульти-выбора строк."
    >
      <p className="text-xs text-muted-foreground">
        Выбрано: {selectedCount} из {data.length}
      </p>
      <Table data={data} columns={columns} size="sm" features={features} />
    </ExampleCard>
  );
};
