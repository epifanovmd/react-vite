import { Table } from "@components/ui";
import type { FC } from "react";

import { ExampleCard } from "../../shared";
import { usePaginationExample } from "./usePaginationExample";

export const PaginationExample: FC = () => {
  const { data, columns, features } = usePaginationExample();

  return (
    <ExampleCard
      title="Пагинация"
      description="usePaginationFeature — постраничная навигация с выбором размера страницы."
    >
      <Table data={data} columns={columns} size="sm" features={features} />
    </ExampleCard>
  );
};
