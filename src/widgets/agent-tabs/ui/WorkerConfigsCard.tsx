import { ConfigStateBadge, formatAgo, formatMoment } from "@entities/agent";
import { Badge, Card, IconButton, TableRowActions, Tooltip } from "@shared/ui";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import type {
  AgentConfigsVM,
  IWorkerConfigGroup,
} from "../model/useAgentConfigsVM";

interface WorkerConfigsCardProps {
  group: IWorkerConfigGroup;
  vm: AgentConfigsVM;
}

/** Ключи настроек воркера: описание, версия, статус применения, действия. */
export const WorkerConfigsCard: FC<WorkerConfigsCardProps> = observer(
  ({ group, vm }) => (
    <Card
      title={group.worker}
      description={
        group.noManifest
          ? "Манифеста нет — какие ключи у воркера, неизвестно"
          : `Ключей в манифесте: ${group.items.filter(item => item.manifest).length}`
      }
    >
      {group.items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {group.noManifest
            ? "Ключи появятся, когда воркер ответит на GET /manifest."
            : "Воркер не объявил ключей настроек."}
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-border">
          {group.items.map(item => {
            const status = item.entry?.status;
            const config = item.entry?.config;

            return (
              <li
                key={item.key}
                className="flex flex-wrap items-start gap-x-3 gap-y-1 py-2.5 first:pt-0 last:pb-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-mono font-medium">{item.key}</span>
                    {!item.manifest && (
                      <Tooltip content="Ключа нет в манифесте воркера: агент его не применит">
                        <Badge variant="warning">не в манифесте</Badge>
                      </Tooltip>
                    )}
                    {status ? (
                      <>
                        <ConfigStateBadge state={status.state} />
                        <span className="text-xs text-muted-foreground">
                          {[
                            status.version !== null &&
                              `версия ${status.version}`,
                            status.applied !== undefined &&
                              status.applied !== status.version &&
                              `применена ${status.applied}`,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      </>
                    ) : (
                      <Badge variant="muted">не задан</Badge>
                    )}
                  </p>
                  {item.manifest?.description && (
                    <p className="text-xs text-muted-foreground">
                      {item.manifest.description}
                    </p>
                  )}
                  {status?.error && (
                    <p className="text-xs text-destructive">
                      {status.error.code}: {status.error.message}
                    </p>
                  )}
                  {config && (
                    <Tooltip content={formatMoment(config.updatedAt)}>
                      <p className="text-xs text-muted-foreground">
                        изменено {formatAgo(config.updatedAt)}
                      </p>
                    </Tooltip>
                  )}
                </div>
                <TableRowActions>
                  {/* Значение ключа сервер отдаёт только с правом на настройки. */}
                  {vm.canConfig && (
                    <Tooltip content={config ? "Изменить" : "Задать"}>
                      <IconButton
                        aria-label={`Ключ ${item.key}`}
                        onClick={() => vm.editor.openFor(item)}
                      >
                        {config ? <Pencil size={15} /> : <Plus size={15} />}
                      </IconButton>
                    </Tooltip>
                  )}
                  {vm.canConfig && status && status.version !== null && (
                    <Tooltip content="Удалить ключ">
                      <IconButton
                        aria-label={`Удалить ${item.key}`}
                        variant="destructive"
                        onClick={() => void vm.editor.remove(item)}
                      >
                        <Trash2 size={15} />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableRowActions>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  ),
);
