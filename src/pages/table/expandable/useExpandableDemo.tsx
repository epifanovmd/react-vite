import { type Row, type SortingState } from "@tanstack/react-table";
import * as React from "react";
import { useCallback, useState } from "react";

import { generateInvoices } from "../table.mock";
import type { Invoice } from "../table.types";
import { createInvoiceColumns } from "../tableColumns";

const data = generateInvoices(20);
const columns = createInvoiceColumns();

interface LineItemsTableProps {
  items: Invoice["items"];
}

const LineItemsTable = ({ items }: LineItemsTableProps) => {
  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );

  return (
    <div className="bg-muted/20 px-8 py-3">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b text-muted-foreground">
            <th className="text-left py-1 pr-4">Товар</th>
            <th className="text-right py-1 px-4">Кол-во</th>
            <th className="text-right py-1 px-4">Цена</th>
            <th className="text-right py-1 pl-4">Итого</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx} className="border-b border-border/50 last:border-0">
              <td className="py-1.5 pr-4">{item.product}</td>
              <td className="py-1.5 px-4 text-right tabular-nums">
                {item.quantity}
              </td>
              <td className="py-1.5 px-4 text-right tabular-nums">
                ${(item.unitPrice / 100).toFixed(2)}
              </td>
              <td className="py-1.5 pl-4 text-right tabular-nums font-medium">
                ${((item.quantity * item.unitPrice) / 100).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="font-medium">
            <td colSpan={3} className="pt-2 text-right">
              Итого:
            </td>
            <td className="pt-2 pl-4 text-right">
              ${(total / 100).toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export interface ExpandableDemoViewModel {
  data: Invoice[];
  columns: typeof columns;
  renderSubComponent: (props: { row: Row<Invoice> }) => React.ReactElement;
  sorting: SortingState;
  onSortingChange: (
    updater: SortingState | ((prev: SortingState) => SortingState),
  ) => void;
  onRowDoubleClick: (invoice: Invoice) => void;
  selectedId: string | null;
}

export const useExpandableDemo = (): ExpandableDemoViewModel => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const renderSubComponent = useCallback(
    (props: { row: Row<Invoice> }) => (
      <LineItemsTable items={props.row.original.items} />
    ),
    [],
  );

  const onRowDoubleClick = useCallback((invoice: Invoice) => {
    alert(
      `Счёт ${invoice.id}\nКлиент: ${invoice.customer}\nСумма: $${(invoice.total / 100).toFixed(2)}\nСтатус: ${invoice.status}\nПозиций: ${invoice.items.length}`,
    );
  }, []);

  return {
    data,
    columns,
    renderSubComponent,
    sorting,
    onSortingChange: setSorting,
    onRowDoubleClick,
    selectedId,
  };
};
