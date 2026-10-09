import { AgentAlertsCard } from "@entities/agent";
import { NODE_PERMISSIONS, NodeStatusBadge } from "@entities/node";
import { PermissionGate } from "@entities/user";
import { AssignNodeOwnerModal } from "@features/assign-node-owner";
import { NodeFormModal } from "@features/manage-node";
import { ProvisionNodeAgentModal } from "@features/provision-node-agent";
import { ownPermission } from "@shared/lib/access";
import {
  Alert,
  PageEmpty,
  PageHeader,
  PageLayout,
  PageLoader,
} from "@shared/ui";
import { AgentTabs, type TAgentTab } from "@widgets/agent-tabs";
import { observer } from "mobx-react-lite";
import { FC, useState } from "react";

import { nodeSubtitle } from "../model/node-subtitle";
import { useNodeDetailVM } from "../model/useNodeDetailVM";
import { NodeAgentEmpty } from "./NodeAgentEmpty";
import { NodeConfigAlert } from "./NodeConfigAlert";
import { NodeHeaderActions } from "./NodeHeaderActions";
import { NodeInfoCard } from "./NodeInfoCard";
import { ProvisionJobBanner } from "./ProvisionJobBanner";

interface NodeDetailProps {
  nodeId: string;
}

/** Карточка узла: шапка с действиями, ход установки, сведения и вкладки агента. */
export const NodeDetail: FC<NodeDetailProps> = observer(({ nodeId }) => {
  const vm = useNodeDetailVM(nodeId);
  const { node, agent } = vm;
  // Журнал — на всю высоту экрана с прокруткой внутри, остальное — страница.
  const [tab, setTab] = useState<TAgentTab>("overview");
  const showTabs = !!agent;

  return (
    <PageLayout
      fill={showTabs && tab === "logs"}
      header={
        node && (
          <PageHeader
            title={
              <span className="flex flex-wrap items-center gap-3">
                {node.name}
                <NodeStatusBadge node={node} />
              </span>
            }
            subtitle={nodeSubtitle(node)}
            actions={<NodeHeaderActions vm={vm} node={node} />}
          />
        )
      }
    >
      <PermissionGate permission={ownPermission(NODE_PERMISSIONS.VIEW)}>
        {!node ? (
          vm.isError ? (
            <PageEmpty icon="error" title="Узел не найден" />
          ) : (
            <PageLoader label="Загрузка узла…" />
          )
        ) : (
          <>
            <ProvisionJobBanner
              job={node.job}
              run={vm.job}
              nodeStatus={node.status}
              agentOnline={!!node.agent?.online}
            />
            <NodeConfigAlert node={node} agent={agent} />
            {vm.addressMismatch && (
              <Alert
                variant="warning"
                title="Агент подключается с другого адреса"
              >
                Адрес узла — {node.host}, а агент выходит на связь с{" "}
                {node.agent?.address}. Проверьте адрес узла: по нему идут вход
                по SSH и проверка связи.
              </Alert>
            )}
            {node.agent?.revoked && (
              <Alert variant="destructive" title="Агент отозван">
                Его ключ больше не принимается. Установите агента заново.
              </Alert>
            )}
            <NodeInfoCard node={node} />
            <AgentAlertsCard alerts={vm.alerts} />
            {!node.agentId ? (
              <NodeAgentEmpty
                node={node}
                onInstall={
                  vm.canProvision ? () => vm.provision.openFor(node) : undefined
                }
              />
            ) : showTabs ? (
              <AgentTabs
                agent={agent}
                access={vm.access}
                value={tab}
                onValueChange={setTab}
              />
            ) : vm.isAgentLoading ? (
              <PageLoader label="Загрузка агента…" />
            ) : (
              <PageEmpty icon="error" title="Агент узла недоступен" />
            )}
          </>
        )}
      </PermissionGate>
      <NodeFormModal vm={vm.form} />
      <AssignNodeOwnerModal vm={vm.owner} />
      <ProvisionNodeAgentModal vm={vm.provision} />
    </PageLayout>
  );
});
