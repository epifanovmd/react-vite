import type {
  INodeMeshCellDto,
  INodeMeshDto,
} from "@shared/api/gen/main/model";
import { cn } from "@shared/lib/utils";
import { Card, Tooltip } from "@shared/ui";
import { FC } from "react";

import { bestByTarget, describeMeshCell, formatRtt } from "../model/mesh-cell";

interface NodeMeshCardProps {
  mesh: INodeMeshDto;
}

const cellKey = (from: string, to: string) => `${from}:${to}`;

/**
 * Связность узлов: строка — откуда проверяют, столбец — куда. Подсвечен
 * лучший путь до узла; потери — по последнему кругу; устаревшее приглушено.
 */
export const NodeMeshCard: FC<NodeMeshCardProps> = ({ mesh }) => {
  if (mesh.nodes.length < 2) return null;

  const cells = new Map<string, INodeMeshCellDto>(
    mesh.cells.map(cell => [cellKey(cell.from, cell.to), cell]),
  );
  const best = bestByTarget(mesh.cells);

  return (
    <Card
      title="Связность узлов"
      description="Задержка в мс между адресами узлов по последнему кругу проверки; подсвечен лучший путь до узла"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="p-2 text-left font-normal text-muted-foreground">
                откуда \ куда
              </th>
              {mesh.nodes.map(node => (
                <th key={node.id} className="p-2 text-right font-medium">
                  {node.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mesh.nodes.map(from => (
              <tr key={from.id} className="border-t border-border">
                <th className="p-2 text-left font-medium">{from.name}</th>
                {mesh.nodes.map(to => {
                  if (from.id === to.id) {
                    return (
                      <td
                        key={to.id}
                        className="p-2 text-right text-muted-foreground"
                      >
                        —
                      </td>
                    );
                  }

                  const cell = cells.get(cellKey(from.id, to.id));
                  const isBest = !!cell && best.get(to.id) === cell;

                  return (
                    <td
                      key={to.id}
                      data-best={isBest ? "" : undefined}
                      data-stale={cell?.stale ? "" : undefined}
                      className={cn(
                        "p-2 text-right font-mono",
                        isBest && "font-semibold text-success",
                        cell && cell.lossPct > 0 && "text-warning",
                        cell?.lossPct === 100 && "text-destructive",
                        cell?.stale && "text-muted-foreground opacity-60",
                      )}
                    >
                      {!cell ? (
                        <span className="text-muted-foreground">·</span>
                      ) : (
                        <Tooltip content={describeMeshCell(cell)}>
                          <span>{formatRtt(cell.rttAvgMs)}</span>
                        </Tooltip>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
