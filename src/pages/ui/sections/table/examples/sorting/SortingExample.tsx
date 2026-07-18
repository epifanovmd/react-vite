import { Table } from "@components/ui";
import type { FC } from "react";

import { ExampleCard } from "../../shared";
import { useSortingExample } from "./useSortingExample";

export const SortingExample: FC = () => {
  const { data, columns, features } = useSortingExample();

  return (
    <ExampleCard
      title="Сортировка"
      description="useSortingFeature — клик по заголовку колонки переключает asc/desc/none."
    >
      <Table data={data} columns={columns} size="sm" features={features} />
    </ExampleCard>
  );
};
