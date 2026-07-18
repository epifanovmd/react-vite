import { Table } from "@components/ui";
import type { FC } from "react";

import { ExampleCard } from "../../shared";
import { useColumnVisibilityExample } from "./useColumnVisibilityExample";

export const ColumnVisibilityExample: FC = () => {
  const { data, columns, features } = useColumnVisibilityExample();

  return (
    <ExampleCard
      title="Видимость колонок"
      description="useColumnVisibilityFeature + showColumnVisibility — переключатель видимых колонок."
    >
      <Table
        data={data}
        columns={columns}
        size="sm"
        features={features}
        showColumnVisibility
      />
    </ExampleCard>
  );
};
