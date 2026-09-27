import { Table } from "@shared/ui";
import type { FC } from "react";

import { ExampleCard } from "../../shared";
import { ColumnOrderChip } from "./ColumnOrderChip";
import { useColumnOrderExample } from "./useColumnOrderExample";

export const ColumnOrderExample: FC = () => {
  const { data, columns, features, columnOrder, moveColumn } =
    useColumnOrderExample();
  const lastIndex = columnOrder.length - 1;

  return (
    <ExampleCard
      title="Порядок колонок"
      description="useColumnOrderFeature — переставляйте колонки кнопками (в реальном UI обычно drag-n-drop)."
    >
      <div className="flex flex-wrap gap-1.5">
        {columnOrder.map((id, index) => (
          <ColumnOrderChip
            key={id}
            id={id}
            isFirst={index === 0}
            isLast={index === lastIndex}
            onMove={moveColumn}
          />
        ))}
      </div>
      <Table data={data} columns={columns} size="sm" features={features} />
    </ExampleCard>
  );
};
