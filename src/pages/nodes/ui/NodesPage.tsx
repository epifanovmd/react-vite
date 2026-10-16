import { PermissionGate } from "@entities/user";
import { AssignNodeOwnerModal } from "@features/assign-node-owner";
import { AgentIssuePanel } from "@features/issue-agent";
import { NodeFormModal } from "@features/manage-node";
import { ProvisionNodeAgentModal } from "@features/provision-node-agent";
import { Button, PageHeader, PageLayout } from "@shared/ui";
import { useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import { useNodesVM } from "../model/useNodesVM";
import { NodesTable } from "./NodesTable";
import { NodesToolbar } from "./NodesToolbar";

export const NodesPage: FC = observer(() => {
  const navigate = useNavigate();
  const vm = useNodesVM();

  return (
    <PageLayout
      header={
        <PageHeader
          title="Узлы"
          subtitle="Машины с агентами: связь, конфигурация, нагрузка, установка"
          actions={
            vm.canCreate && (
              <Button
                leftIcon={<Plus size={15} />}
                onClick={vm.form.openCreate}
              >
                Новый узел
              </Button>
            )
          }
        />
      }
    >
      <PermissionGate
        permission={vm.viewPermission}
        onDenied={() => void navigate({ to: "/", replace: true })}
      >
        <NodesToolbar vm={vm} />
        <NodesTable vm={vm} />
      </PermissionGate>
      <NodeFormModal vm={vm.form} />
      <AssignNodeOwnerModal vm={vm.owner} />
      <ProvisionNodeAgentModal
        vm={vm.provision}
        archive={
          vm.provision.node && (
            <AgentIssuePanel
              key={vm.provision.node.id}
              target={{ node: vm.provision.node }}
            />
          )
        }
      />
    </PageLayout>
  );
});
