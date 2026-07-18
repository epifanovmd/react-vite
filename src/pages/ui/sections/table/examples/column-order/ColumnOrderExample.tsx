import { Table } from "@components/ui";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { FC } from "react";

import { ExampleCard } from "../../shared";
import { COLUMN_LABELS } from "./columnLabels";
import { useColumnOrderExample } from "./useColumnOrderExample";

export const ColumnOrderExample: FC = () => {
  const { data, columns, features, columnOrder, moveColumn } =
    useColumnOrderExample();

  return (
    <ExampleCard
      title="Порядок колонок"
      description="useColumnOrderFeature — переставляйте колонки кнопками (в реальном UI обычно drag-n-drop)."
    >
      <div className="flex flex-wrap gap-1.5">
        {columnOrder.map((id, index) => (
          <div
            key={id}
            className="flex items-center gap-0.5 rounded-md border px-1.5 py-1 text-xs"
          >
            <button
              type="button"
              disabled={index === 0}
              onClick={() => moveColumn(id, -1)}
              className="text-muted-foreground hover:text-foreground disabled:opacity-30"
              aria-label={`Сдвинуть ${COLUMN_LABELS[id] ?? id} влево`}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>
            <span>{COLUMN_LABELS[id] ?? id}</span>
            <button
              type="button"
              disabled={index === columnOrder.length - 1}
              onClick={() => moveColumn(id, 1)}
              className="text-muted-foreground hover:text-foreground disabled:opacity-30"
              aria-label={`Сдвинуть ${COLUMN_LABELS[id] ?? id} вправо`}
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
      <Table data={data} columns={columns} size="sm" features={features} />
    </ExampleCard>
  );
};
