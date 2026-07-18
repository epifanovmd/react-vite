import { Table } from "@components/ui";
import type { FC } from "react";

import { ExampleCard } from "../../shared";
import { useBasicExample } from "./useBasicExample";

export const BasicExample: FC = () => {
  const { data, columns } = useBasicExample();

  return (
    <ExampleCard
      title="Базовое использование"
      description="Минимальный набор пропов: data + columns, без единой фичи."
    >
      <Table data={data} columns={columns} size="sm" />
    </ExampleCard>
  );
};
