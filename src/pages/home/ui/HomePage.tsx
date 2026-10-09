import { AgentAlertsCard, AlertAgentLink } from "@entities/agent";
import { PageHeader, PageLayout, PageLoader } from "@shared/ui";
import { Navigate } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import { useHomeVM } from "../model/useHomeVM";
import { DashboardNodesCard } from "./DashboardNodesCard";

/** Главная: сводка по узлам и проблемы агентов; без права на узлы — профиль. */
export const HomePage: FC = observer(() => {
  const vm = useHomeVM();

  if (!vm.isReady) return <PageLoader label="Загрузка…" />;
  if (!vm.canViewNodes) return <Navigate to="/profile" replace />;

  return (
    <PageLayout
      header={<PageHeader title="Главная" subtitle="Сводка по узлам" />}
    >
      <DashboardNodesCard vm={vm} />
      <AgentAlertsCard
        alerts={vm.alerts}
        renderAgent={alert => <AlertAgentLink alert={alert} />}
      />
    </PageLayout>
  );
});
