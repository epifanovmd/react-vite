import {
  AGENT_PERMISSIONS,
  AgentAlertsCard,
  AlertAgentLink,
} from "@entities/agent";
import { PermissionGate } from "@entities/user";
import { InstallAgentModal } from "@features/enroll-agent";
import { AgentIssuePanel } from "@features/issue-agent";
import { Button, PageHeader, PageLayout } from "@shared/ui";
import { Link, useNavigate } from "@tanstack/react-router";
import { HardDriveDownload } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import { useAgentsVM } from "../model/useAgentsVM";
import { AgentsTable } from "./AgentsTable";

export const AgentsPage: FC = observer(() => {
  const navigate = useNavigate();
  const vm = useAgentsVM();

  return (
    <PageLayout
      header={
        <PageHeader
          title="Агенты"
          subtitle="Программы на узлах: связь, воркеры, нагрузка, обновление"
          actions={
            vm.canEnroll && (
              <Button
                leftIcon={<HardDriveDownload size={15} />}
                onClick={vm.install.openDialog}
              >
                Установить агента
              </Button>
            )
          }
        />
      }
    >
      <PermissionGate
        permission={AGENT_PERMISSIONS.VIEW}
        onDenied={() => void navigate({ to: "/", replace: true })}
      >
        <AgentAlertsCard
          alerts={vm.alerts}
          renderAgent={alert => (
            <AlertAgentLink
              alert={alert}
              renderLink={({ agentId, ...props }) => (
                <Link to="/agents/$agentId" params={{ agentId }} {...props} />
              )}
            />
          )}
        />
        <AgentsTable vm={vm} />
      </PermissionGate>
      <InstallAgentModal
        vm={vm.install}
        archive={vm.canEnroll && <AgentIssuePanel target={{}} />}
      />
    </PageLayout>
  );
});
