import { NodeStatusBadge } from "@entities/node";
import { Button, Card, Empty, Skeleton, StatCard } from "@shared/ui";
import { Link } from "@tanstack/react-router";
import { CircleAlert, Server, Wifi, WifiOff } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import type { HomeVM } from "../model/useHomeVM";

interface DashboardNodesCardProps {
  vm: HomeVM;
}

/** Узлы: сколько всего, на связи, без связи, с ошибкой; кому нужно внимание. */
export const DashboardNodesCard: FC<DashboardNodesCardProps> = observer(
  ({ vm }) => {
    const { counts } = vm;

    return (
      <Card
        title="Узлы"
        description="Связь агентов и ошибки"
        extra={
          <Button variant="ghost" size="sm" asChild>
            <Link to="/nodes">Все узлы</Link>
          </Button>
        }
      >
        {vm.isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : counts.total === 0 ? (
          <Empty
            size="sm"
            title="Узлов пока нет"
            description="Создайте узел и установите на него агента"
          />
        ) : (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatCard
                title="Всего"
                value={counts.total}
                icon={<Server size={18} />}
              />
              <StatCard
                title="На связи"
                value={counts.online}
                icon={<Wifi size={18} />}
                variant="success"
              />
              <StatCard
                title="Без связи"
                value={counts.offline}
                icon={<WifiOff size={18} />}
                variant={counts.offline > 0 ? "destructive" : "default"}
              />
              <StatCard
                title="С ошибкой"
                value={counts.error}
                icon={<CircleAlert size={18} />}
                variant={counts.error > 0 ? "destructive" : "default"}
              />
            </div>
            {vm.troubled.length > 0 && (
              <ul className="flex flex-col divide-y divide-border">
                {vm.troubled.map(node => (
                  <li
                    key={node.id}
                    className="flex items-center justify-between gap-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <Link
                        to="/nodes/$nodeId"
                        params={{ nodeId: node.id }}
                        className="truncate text-sm font-medium hover:underline"
                      >
                        {node.name}
                      </Link>
                      <p className="truncate text-xs text-muted-foreground">
                        {node.statusMessage ?? node.host ?? "—"}
                      </p>
                    </div>
                    <NodeStatusBadge node={node} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </Card>
    );
  },
);
