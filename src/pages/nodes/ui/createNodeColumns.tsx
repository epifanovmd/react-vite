import {
  NodeConfigBadge,
  NodeOwnershipCell,
  NodeStatusBadge,
} from "@entities/node";
import type { NodeDto } from "@shared/api/gen/main/model";
import {
  createColumnHelper,
  IconButton,
  stopRowClick,
  TableRowActions,
  Tooltip,
} from "@shared/ui";
import { Link } from "@tanstack/react-router";
import { HardDriveDownload, Pencil, Trash2, UserCog } from "lucide-react";
import type { RefObject } from "react";

import type { NodesVM } from "../model/useNodesVM";
import { NodeAgentCell } from "./NodeAgentCell";
import { NodeLoadCell } from "./NodeLoadCell";

const column = createColumnHelper<NodeDto>();

interface NodeColumnsOptions {
  /** VM — через ref: колонки стабильны, ячейки не перемонтируются. */
  vm: RefObject<NodesVM>;
}

/** Колонки таблицы узлов. */
export const createNodeColumns = ({ vm }: NodeColumnsOptions) => [
  column.display({
    id: "name",
    header: "Узел",
    meta: { label: "Узел" },
    cell: ({ row }) => (
      <div className="min-w-0">
        <Link
          to="/nodes/$nodeId"
          params={{ nodeId: row.original.id }}
          className="truncate font-medium hover:underline"
          onClick={stopRowClick}
        >
          {row.original.name}
        </Link>
        <p className="truncate text-xs text-muted-foreground">
          {row.original.host ?? "адрес не задан"}
          {row.original.description && ` · ${row.original.description}`}
        </p>
      </div>
    ),
  }),
  column.display({
    id: "owner",
    header: "Владелец",
    size: 160,
    cell: ({ row }) => (
      <NodeOwnershipCell
        owner={row.original.ownerName}
        creator={row.original.createdByName}
      />
    ),
  }),
  column.display({
    id: "status",
    header: "Статус",
    // Без связи в бейдже — ещё и сколько прошло: «Нет связи · 12 мин назад».
    size: 190,
    cell: ({ row }) => <NodeStatusBadge node={row.original} />,
  }),
  column.display({
    id: "agent",
    header: "Агент",
    size: 170,
    cell: ({ row }) => <NodeAgentCell node={row.original} />,
  }),
  column.display({
    id: "config",
    header: "Конфигурация",
    size: 150,
    cell: ({ row }) => <NodeConfigBadge config={row.original.config} />,
  }),
  column.display({
    id: "load",
    header: "Нагрузка",
    size: 150,
    // Связь — по узлу (приходит событием сразу), метрики — `node:load`.
    cell: ({ row }) => (
      <NodeLoadCell
        point={
          row.original.agent?.online ? vm.current.loadOf(row.original) : null
        }
      />
    ),
  }),
  column.display({
    id: "actions",
    size: 150,
    meta: { align: "right" },
    cell: ({ row }) => {
      const access = vm.current.accessOf(row.original);

      return (
        <TableRowActions>
          {access.canProvision && !row.original.agent?.online && (
            <Tooltip content="Установить агента">
              <IconButton
                aria-label="Установить агента"
                onClick={() => vm.current.provision.openFor(row.original)}
              >
                <HardDriveDownload size={15} />
              </IconButton>
            </Tooltip>
          )}
          {access.canAssign && (
            <Tooltip content="Владелец">
              <IconButton
                aria-label="Владелец"
                onClick={() => vm.current.owner.openFor(row.original)}
              >
                <UserCog size={15} />
              </IconButton>
            </Tooltip>
          )}
          {access.canUpdate && (
            <Tooltip content="Изменить">
              <IconButton
                aria-label="Изменить"
                onClick={() => vm.current.form.openEdit(row.original)}
              >
                <Pencil size={15} />
              </IconButton>
            </Tooltip>
          )}
          {access.canDelete && (
            <Tooltip content="Удалить">
              <IconButton
                aria-label="Удалить"
                variant="destructive"
                onClick={() => void vm.current.remove(row.original)}
              >
                <Trash2 size={15} />
              </IconButton>
            </Tooltip>
          )}
        </TableRowActions>
      );
    },
  }),
];
