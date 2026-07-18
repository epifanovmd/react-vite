import { Table } from "@components/ui";
import type { FC } from "react";

import { ExampleCard } from "../../shared";
import { useColumnPinningExample } from "./useColumnPinningExample";

export const ColumnPinningExample: FC = () => {
  const { data, columns, features } = useColumnPinningExample();

  return (
    <ExampleCard
      title="Закрепление колонок"
      description="useColumnPinningFeature — ID закреплён слева, Сумма справа. Сузьте окно и прокрутите по горизонтали."
    >
      <Table
        data={data}
        columns={columns}
        size="sm"
        features={features}
        showColumnVisibility
        containerClassName="max-w-md"
      />
    </ExampleCard>
  );
};
