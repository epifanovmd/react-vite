import { Table } from "@components/ui";
import type { FC } from "react";

import { ExampleCard } from "../../shared";
import { useGroupingExample } from "./useGroupingExample";

export const GroupingExample: FC = () => {
  const { data, columns, features } = useGroupingExample();

  return (
    <ExampleCard
      title="Группировка"
      description="useGroupingFeature — строки сгруппированы по статусу, с агрегацией суммы и позиций."
    >
      <Table data={data} columns={columns} size="sm" features={features} />
    </ExampleCard>
  );
};
