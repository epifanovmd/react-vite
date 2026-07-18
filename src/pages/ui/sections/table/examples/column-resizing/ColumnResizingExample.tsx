import { Table } from "@components/ui";
import type { FC } from "react";

import { ExampleCard } from "../../shared";
import { useColumnResizingExample } from "./useColumnResizingExample";

export const ColumnResizingExample: FC = () => {
  const { data, columns, features } = useColumnResizingExample();

  return (
    <ExampleCard
      title="Изменение ширины колонок"
      description="useColumnSizingFeature — потяните за правый край заголовка колонки."
    >
      <Table data={data} columns={columns} size="sm" features={features} />
    </ExampleCard>
  );
};
