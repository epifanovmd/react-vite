import type { NodeDto } from "@shared/api/gen/main/model";
import { Button, Tooltip } from "@shared/ui";
import { Link } from "@tanstack/react-router";
import {
  ArrowUpCircle,
  HardDriveDownload,
  KeyRound,
  PackageX,
  Pencil,
  Server,
  Trash2,
  UserCog,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import type { NodeDetailVM } from "../model/useNodeDetailVM";

interface NodeHeaderActionsProps {
  vm: NodeDetailVM;
  node: NodeDto;
}

/** Действия с узлом и его агентом в шапке карточки. */
export const NodeHeaderActions: FC<NodeHeaderActionsProps> = observer(
  ({ vm, node }) => {
    const { agent, agentActions } = vm;
    const hasAgent = !!node.agentId;

    return (
      <div className="flex flex-wrap gap-2">
        {vm.canProvision && !node.agent?.online && (
          <Button
            variant="outline"
            leftIcon={<HardDriveDownload size={15} />}
            onClick={() => vm.provision.openFor(node)}
          >
            Установить агента
          </Button>
        )}
        {vm.canProvision && hasAgent && (
          <Button
            variant="outline"
            leftIcon={<PackageX size={15} />}
            onClick={() => vm.provision.openFor(node, "uninstall")}
          >
            Удалить агента
          </Button>
        )}
        {agent && vm.canUpdateAgent && (
          <Tooltip
            content={
              vm.updateTarget
                ? `Доступна версия ${vm.updateTarget}: агент скачает её с сервера и перезапустится`
                : "Есть новая версия: агент скачает её с сервера и перезапустится"
            }
          >
            <span className="inline-flex">
              <Button
                variant="outline"
                leftIcon={<ArrowUpCircle size={15} />}
                loading={agentActions.isBusy("update", agent.id)}
                onClick={() => void agentActions.update(agent, vm.updateTarget)}
              >
                Обновить агента
              </Button>
            </span>
          </Tooltip>
        )}
        {agent && vm.canRotate && (
          <Button
            variant="outline"
            leftIcon={<KeyRound size={15} />}
            loading={agentActions.isBusy("rotate", agent.id)}
            onClick={() => void agentActions.rotateKey(agent)}
          >
            Сменить ключ
          </Button>
        )}
        {vm.canUpdate && (
          <Button
            variant="outline"
            leftIcon={<Pencil size={15} />}
            onClick={() => vm.form.openEdit(node)}
          >
            Изменить
          </Button>
        )}
        {vm.canAssign && (
          <Button
            variant="outline"
            leftIcon={<UserCog size={15} />}
            onClick={() => vm.owner.openFor(node)}
          >
            Владелец
          </Button>
        )}
        {vm.canViewAgents && node.agentId && (
          <Button variant="ghost" leftIcon={<Server size={15} />} asChild>
            <Link to="/agents/$agentId" params={{ agentId: node.agentId }}>
              Страница агента
            </Link>
          </Button>
        )}
        {vm.canDelete && (
          <Button
            variant="destructive"
            leftIcon={<Trash2 size={15} />}
            onClick={() => void vm.removeNode(node)}
          >
            Удалить
          </Button>
        )}
      </div>
    );
  },
);
