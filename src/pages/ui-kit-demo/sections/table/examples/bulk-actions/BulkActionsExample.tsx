import { Button, Table, type TableBulkSelection } from "@shared/ui";
import type { FC } from "react";

import { ExampleCard, type Order } from "../../shared";
import { useBulkActionsExample } from "./useBulkActionsExample";

export const BulkActionsExample: FC = () => {
  const { data, columns, features, getRowId, markPaid, remove, restore } =
    useBulkActionsExample();

  const renderBulkActions = ({ rows, clear }: TableBulkSelection<Order>) => {
    const handleMarkPaid = () => {
      markPaid(rows);
      clear();
    };

    const handleRemove = () => {
      remove(rows);
      clear();
    };

    return (
      <>
        <Button size="sm" variant="outline" onClick={handleMarkPaid}>
          Отметить оплаченными
        </Button>
        <Button size="sm" variant="destructive" onClick={handleRemove}>
          Удалить
        </Button>
      </>
    );
  };

  return (
    <ExampleCard
      title="Массовые действия"
      description="bulkActions — панель «Выбрано: N» с действиями над выбранными строками и сбросом выделения."
    >
      <Table
        data={data}
        columns={columns}
        size="sm"
        features={features}
        getRowId={getRowId}
        bulkActions={renderBulkActions}
        toolbar={
          <Button size="sm" variant="ghost" onClick={restore}>
            Вернуть данные
          </Button>
        }
      />
    </ExampleCard>
  );
};
