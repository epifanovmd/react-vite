import { Table } from "@components/ui";
import type { FC } from "react";

import { ExampleCard } from "../../shared";
import { useExpandingExample } from "./useExpandingExample";

export const ExpandingExample: FC = () => {
  const { data, columns, features } = useExpandingExample();

  return (
    <ExampleCard
      title="Разворачивание строк"
      description="useExpandingFeature — шеврон слева раскрывает деталь заказа под строкой."
    >
      <Table data={data} columns={columns} size="sm" features={features} />
    </ExampleCard>
  );
};
