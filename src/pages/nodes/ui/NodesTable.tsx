import { useLatestRef } from "@shared/lib/hooks";
import { Empty, Table } from "@shared/ui";
import { useNavigate } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import { FC, useMemo } from "react";

import type { NodesVM } from "../model/useNodesVM";
import { createNodeColumns } from "./createNodeColumns";

interface NodesTableProps {
  vm: NodesVM;
}

/** Таблица узлов; строка открывает карточку узла. */
export const NodesTable: FC<NodesTableProps> = observer(({ vm }) => {
  const navigate = useNavigate();
  const vmRef = useLatestRef(vm);
  const { accessKey } = vm;
  // Права действий считаются по строке; при смене прав колонки пересобираются.
  const columns = useMemo(
    () => createNodeColumns({ vm: vmRef }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accessKey, vmRef],
  );

  return (
    <Table
      className="flex-none"
      data={vm.nodes}
      columns={columns}
      loading={vm.isLoading}
      error={
        vm.error ? (
          <Empty size="sm" icon="error" title={vm.error.message} />
        ) : undefined
      }
      labels={{
        empty:
          vm.total > 0
            ? "Под фильтр ничего не подошло"
            : vm.canCreate
              ? "Узлов пока нет — нажмите «Новый узел»"
              : "Узлов пока нет",
      }}
      getRowId={node => node.id}
      onRowClick={node =>
        void navigate({ to: "/nodes/$nodeId", params: { nodeId: node.id } })
      }
      aria-label="Узлы"
    />
  );
});
