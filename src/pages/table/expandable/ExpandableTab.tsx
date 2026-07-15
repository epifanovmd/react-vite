import {
  Card,
  CardContent,
  Table,
} from "@components/ui";
import { type FC } from "react";

import { useExpandableDemo } from "./useExpandableDemo";

export interface ExpandableTabProps {
  density: "sm" | "md" | "lg";
  variant: "default" | "striped" | "bordered";
  sticky: boolean;
  resizable: boolean;
}

export const ExpandableTab: FC<ExpandableTabProps> = ({
  density,
  variant,
  sticky,
  resizable,
}) => {
  const vm = useExpandableDemo();

  return (
    <Card
      className="flex flex-1 flex-col overflow-hidden"
      title={<span className="text-base">Expandable строки (Invoice → Items)</span>}
      description={
        <span className="text-xs">
          Sub-rows через renderSubComponent (вложенная таблица),
          selection=&quot;single&quot;, onRowDoubleClick, rowClassName.
        </span>
      }
      contentClassName="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden p-6 pt-0"
    >
      <Table
        data={vm.data}
        columns={vm.columns}
        size={density}
        variant={variant}
        stickyHeader={sticky}
        sorting
        sortingState={vm.sorting}
        onSortingChange={vm.onSortingChange}
        selection="single"
        renderSubComponent={vm.renderSubComponent}
        onRowDoubleClick={vm.onRowDoubleClick}
        getRowId={invoice => invoice.id}
        resizable={resizable}
        rowClassName={invoice =>
          invoice.status === "failed" ? "bg-destructive/5" : ""
        }
      >
        <Table.ColumnVisibility />
        <Table.Pagination pageSizeOptions={[5, 10, 20]} />
      </Table>
    </Card>
  );
};
