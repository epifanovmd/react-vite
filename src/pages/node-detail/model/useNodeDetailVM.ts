import { AGENT_PERMISSIONS, IAgentsStore, isAgentLive } from "@entities/agent";
import { IJobStore } from "@entities/job";
import {
  INodesStore,
  NODE_PERMISSIONS,
  nodeAddressMismatch,
  nodeOwners,
} from "@entities/node";
import { IUserStore } from "@entities/user";
import { useAssignNodeOwnerVM } from "@features/assign-node-owner";
import { useAgentActions } from "@features/manage-agent";
import { useDeleteNode, useNodeFormVM } from "@features/manage-node";
import { useProvisionNodeAgentVM } from "@features/provision-node-agent";
import type {
  AgentAlertDto,
  AgentDto,
  NodeDto,
} from "@shared/api/gen/main/model";
import type { Permission } from "@shared/lib/access";
import { useEntity } from "@shared/lib/holders";
import { useCloseWhenForbidden } from "@shared/lib/hooks";
import { INotificationService } from "@shared/lib/notifications";
import { useSocketEvent, useSocketRoom } from "@shared/lib/socket";
import { useNavigate } from "@tanstack/react-router";
import type { IAgentTabsAccess } from "@widgets/agent-tabs";
import { useEffect } from "react";

/**
 * Карточка узла: узел и его агент из сторов (обновляются событиями комнат
 * узла и агента), последняя задача установки, действия. Права на действия —
 * по области прав на этот узел (свой — владелец или создатель); на вкладках
 * агента — права узла.
 */
export const useNodeDetailVM = (nodeId: string) => {
  const store = INodesStore.useInstance();
  const agents = IAgentsStore.useInstance();
  const jobs = IJobStore.useInstance();
  const userStore = IUserStore.useInstance();
  const toast = INotificationService.useInstance();
  const navigate = useNavigate();
  const canView = userStore.scope(NODE_PERMISSIONS.VIEW) !== null;
  const canViewAgents = userStore.can(AGENT_PERMISSIONS.VIEW);

  const card = useEntity<true, string>({
    queryFn: async id => {
      const { error } = await store.fetch(id);

      return error ? { error } : { data: true };
    },
    watch: [nodeId],
    enabled: canView,
  });

  const node = store.byId(nodeId) ?? null;
  const agentId = canView ? (node?.agentId ?? null) : null;
  const jobId = canView ? (node?.job?.id ?? null) : null;
  const owners = node ? nodeOwners(node) : [];
  const can = (permission: Permission) =>
    !!node && userStore.canOn(permission, owners);

  const agentCard = useEntity<true, string>({
    queryFn: async id => {
      const { error } = await agents.fetch(id);

      return error ? { error } : { data: true };
    },
    watch: [agentId ?? ""],
    enabled: !!agentId,
  });

  // Задача установки целиком (с журналом); дальше — `job:updated`.
  const job = useEntity<true, string>({
    queryFn: async id => {
      const data = await jobs.fetch(id);

      return data
        ? { data: true }
        : { error: { message: "Задача не найдена" } };
    },
    watch: [jobId ?? ""],
    enabled: !!jobId,
  });

  useEffect(() => {
    if (!agentId) return;
    void agents.loadAlerts();
    // Выпуск — только с правом на агентов: из него кандидаты обновления.
    if (canViewAgents) void agents.loadRelease();
  }, [agentId, agents, canViewAgents]);

  useSocketRoom("node", canView ? nodeId : null, () => {
    void card.refresh(nodeId);
  });
  // Комната агента: сервер держит наблюдателя — частые метрики и журнал.
  useSocketRoom("agent", agentId, () => {
    if (agentId) void agentCard.refresh(agentId);
  });
  useSocketEvent<[NodeDto]>(
    "node:updated",
    next => {
      if (next.id === nodeId) store.upsert(next);
    },
    canView,
  );
  useSocketEvent<[{ id: string }]>(
    "node:deleted",
    ({ id }) => {
      if (id !== nodeId) return;
      store.remove(id);
      toast.warning("Узел удалён или больше недоступен");
      void navigate({ to: "/nodes" });
    },
    canView,
  );
  useSocketEvent<[AgentDto]>(
    "agent:updated",
    next => {
      if (next.id === agentId) agents.upsert(next);
    },
    !!agentId,
  );
  useSocketEvent<[AgentAlertDto]>(
    "agent:alert",
    alert => {
      if (alert.agentId === agentId) agents.applyAlert(alert);
    },
    !!agentId,
  );

  const form = useNodeFormVM({ onSaved: store.upsert });
  const owner = useAssignNodeOwnerVM({ onSaved: store.upsert });
  const provision = useProvisionNodeAgentVM({
    onStarted: () => void card.refresh(nodeId),
  });
  const removeNode = useDeleteNode({
    onDeleted: deleted => {
      store.remove(deleted.id);
      void navigate({ to: "/nodes" });
    },
  });
  const agentActions = useAgentActions();

  const agent = agentId ? (agents.byId(agentId) ?? null) : null;
  const canUpdate = can(NODE_PERMISSIONS.UPDATE);
  const canAssign = can(NODE_PERMISSIONS.ASSIGN);
  const canProvision = can(NODE_PERMISSIONS.PROVISION);
  const canAgent = can(NODE_PERMISSIONS.AGENT);

  useCloseWhenForbidden(form.open, canUpdate, () => form.setOpen(false));
  useCloseWhenForbidden(!!owner.node, canAssign, owner.close);
  useCloseWhenForbidden(!!provision.node, canProvision, provision.close);

  const access: IAgentTabsAccess = {
    canManage: canAgent,
    canConfig: canAgent,
    canFetch: canAgent,
    canLogs: can(NODE_PERMISSIONS.LOGS),
  };
  const agentLive = canAgent && !!agent && isAgentLive(agent);

  return {
    node,
    isError: card.isError && !node,
    agent,
    isAgentLoading: !!agentId && !agent && !agentCard.isError,
    alerts: agentId ? agents.alertsOf(agentId) : [],
    /** Последняя задача установки или удаления: полная, если уже загружена. */
    job: jobId ? (jobs.byId(jobId) ?? null) : null,
    isJobLoading: job.isLoading,
    addressMismatch: node ? nodeAddressMismatch(node) : false,
    form,
    owner,
    provision,
    removeNode,
    agentActions,
    /** Можно обновить агента: на связи и в выпуске есть другая версия. */
    canUpdateAgent: agentLive && !!node?.agent?.updateAvailable,
    /** Версия выпуска для обновления; без права на выпуск — неизвестна. */
    updateTarget: agentId
      ? (agents.updateCandidate(agentId)?.target ?? null)
      : null,
    canRotate: agentLive,
    canView,
    canViewAgents,
    canUpdate,
    canDelete: can(NODE_PERMISSIONS.DELETE),
    canAssign,
    canProvision,
    access,
  };
};

export type NodeDetailVM = ReturnType<typeof useNodeDetailVM>;
