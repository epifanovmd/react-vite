import { Table } from "@components/ui";
import type { FC } from "react";

import { ExampleCard } from "../../shared";
import { useColumnFiltersExample } from "./useColumnFiltersExample";

export const ColumnFiltersExample: FC = () => {
  const { data, columns, features } = useColumnFiltersExample();

  return (
    <ExampleCard
      title="Фильтры по колонкам"
      description="useColumnFiltersFeature — иконка фильтра в заголовке: текст, мультиселект, диапазон дат."
    >
      <Table data={data} columns={columns} size="sm" features={features} />
    </ExampleCard>
  );
};
