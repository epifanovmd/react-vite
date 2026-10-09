import {
  AGENT_PERMISSIONS,
  IAgentsStore,
  isAgentLive,
  useAgentsRealtime,
} from "@entities/agent";
import { INodesStore, NODE_PERMISSIONS } from "@entities/node";
import { IUserStore } from "@entities/user";
import { useAgentActions } from "@features/manage-agent";
import { ownPermission } from "@shared/lib/access";
import { useEntity } from "@shared/lib/holders";
import { INotificationService } from "@shared/lib/notifications";
import { useSocketEvent, useSocketRoom } from "@shared/lib/socket";
import { useNavigate } from "@tanstack/react-router";
import type { IAgentTabsAccess } from "@widgets/agent-tabs";
import { useEffect } from "react";

/**
 * Карточка агента: данные из стора (обновляются событиями), проблемы, выпуск,
 * права на вкладки и действия с агентом. Пока страница открыта, сокет в
 * комнате агента — сервер держит наблюдателя: частые метрики и журнал.
 */
export const useAgentDetailVM = (agentId: string) => {
  const store = IAgentsStore.useInstance();
  const userStore = IUserStore.useInstance();
  const toast = INotificationService.useInstance();
  const navigate = useNavigate();
  const canView = userStore.can(AGENT_PERMISSIONS.VIEW);
  const canManage = userStore.can(AGENT_PERMISSIONS.MANAGE);
  const nodes = INodesStore.useInstance();
  const canViewNodes = userStore.can(ownPermission(NODE_PERMISSIONS.VIEW));

  const card = useEntity<true, string>({
    queryFn: async id => {
      const { error } = await store.fetch(id);

      return error ? { error } : { data: true };
    },
    watch: [agentId],
    enabled: canView,
  });

  useEffect(() => {
    if (!canView) return;
    void store.loadAlerts();
    void store.loadRelease();
  }, [canView, store]);

  // Узел агента — из списка узлов: ссылка на карточку узла.
  useEffect(() => {
    if (canViewNodes && !nodes.isLoaded) void nodes.load();
  }, [canViewNodes, nodes]);

  // Проблемы и изменения агента приходят в комнату списка.
  useAgentsRealtime(canView);
  useSocketRoom("agent", canView ? agentId : null, () => {
    void card.refresh(agentId);
  });
  useSocketEvent<[{ id: string }]>(
    "agent:deleted",
    ({ id }) => {
      if (id !== agentId) return;
      toast.warning("Агент удалён");
      void navigate({ to: "/agents" });
    },
    canView,
  );

  const actions = useAgentActions({
    onDeleted: () => void navigate({ to: "/agents" }),
  });

  const agent = store.byId(agentId) ?? null;
  const candidate = store.updateCandidate(agentId);
  const live = !!agent && isAgentLive(agent);

  return {
    agent,
    /** Узел этого агента; нет или нет права на узлы — `null`. */
    node: canViewNodes
      ? (nodes.nodes.find(item => item.agentId === agentId) ?? null)
      : null,
    isLoading: card.isLoading || (!agent && !card.isError),
    isError: card.isError && !agent,
    alerts: store.alertsOf(agentId),
    actions,
    /** Версия выпуска, до которой можно обновить агента; нельзя — `null`. */
    updateTo: live && canManage && candidate ? candidate.target : null,
    canRotate: live && canManage,
    canRevoke: !!agent && canManage && !agent.revoked,
    canDelete: !!agent && canManage && agent.revoked,
    canView,
    canManage,
    /** Права на вкладках — права раздела агентов. */
    access: {
      canManage,
      canConfig: userStore.can(AGENT_PERMISSIONS.CONFIG),
      canFetch: userStore.can(AGENT_PERMISSIONS.FETCH),
      canLogs: userStore.can(AGENT_PERMISSIONS.LOGS),
    } satisfies IAgentTabsAccess,
  };
};

export type AgentDetailVM = ReturnType<typeof useAgentDetailVM>;
