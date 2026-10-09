import {
  AGENT_PERMISSIONS,
  IAgentsStore,
  useAgentsRealtime,
} from "@entities/agent";
import {
  filterNodes,
  type INodeFilter,
  INodesStore,
  NODE_PERMISSIONS,
  nodeOwners,
  useNodesRealtime,
} from "@entities/node";
import { IUserStore } from "@entities/user";
import { useAssignNodeOwnerVM } from "@features/assign-node-owner";
import { useDeleteNode, useNodeFormVM } from "@features/manage-node";
import { useProvisionNodeAgentVM } from "@features/provision-node-agent";
import { IMainApi } from "@shared/api";
import type {
  IAgentMetricsPointDto,
  INodeMeshDto,
  NodeDto,
} from "@shared/api/gen/main/model";
import { ownPermission } from "@shared/lib/access";
import { useEntity } from "@shared/lib/holders";
import { useCloseWhenForbidden } from "@shared/lib/hooks";
import { useSocketEvent } from "@shared/lib/socket";
import { useEffect, useRef, useState } from "react";

/** Состав матрицы связности: id, название и адрес узлов. */
const meshKey = (nodes: NodeDto[]): string =>
  nodes.map(node => `${node.id}:${node.name}:${node.host ?? ""}`).join("|");

/** Действия над узлом в строке таблицы по области прав. */
export interface INodeRowAccess {
  canUpdate: boolean;
  canDelete: boolean;
  canAssign: boolean;
  canProvision: boolean;
}

/**
 * Узлы: список с фильтром, связность, нагрузка и действия. С областью
 * «свои» — только свои узлы (владелец или создатель); действия считаются по
 * строке. Связность и нагрузка — снимок, дальше события (`node:mesh`,
 * `node:load`): в комнате `nodes` или лично своим.
 */
export const useNodesVM = () => {
  const api = IMainApi.useInstance();
  const userStore = IUserStore.useInstance();
  const store = INodesStore.useInstance();
  const agents = IAgentsStore.useInstance();
  const viewScope = userStore.scope(NODE_PERMISSIONS.VIEW);
  const canView = viewScope !== null;
  const canViewAgents = userStore.can(AGENT_PERMISSIONS.VIEW);
  const canCreate = userStore.can(NODE_PERMISSIONS.CREATE);
  const [filter, setFilter] = useState<INodeFilter>({
    query: "",
    mine: false,
  });

  const accessOf = (node: NodeDto): INodeRowAccess => {
    const owners = nodeOwners(node);

    return {
      canUpdate: userStore.canOn(NODE_PERMISSIONS.UPDATE, owners),
      canDelete: userStore.canOn(NODE_PERMISSIONS.DELETE, owners),
      canAssign: userStore.canOn(NODE_PERMISSIONS.ASSIGN, owners),
      canProvision: userStore.canOn(NODE_PERMISSIONS.PROVISION, owners),
    };
  };

  const form = useNodeFormVM({ onSaved: store.upsert });
  const remove = useDeleteNode({ onDeleted: node => store.remove(node.id) });
  const owner = useAssignNodeOwnerVM({ onSaved: store.upsert });
  const provision = useProvisionNodeAgentVM();

  // Связность — снимок, дальше `node:mesh` (комната `nodes` или лично своим).
  const mesh = useEntity<INodeMeshDto>({
    queryFn: () => api.getNodeMesh(),
    autoLoad: true,
    enabled: canView,
  });

  useEffect(() => {
    if (!canView) return;
    void store.load();
    // Нагрузка — снимок из метрик агентов узлов, дальше `node:load`.
    void agents.load();
  }, [canView, store, agents]);

  useNodesRealtime(viewScope);
  useAgentsRealtime(canViewAgents);
  useSocketEvent<[INodeMeshDto]>("node:mesh", mesh.setData, canView);

  // Узел добавлен, удалён или переименован — состав матрицы перечитывается.
  const nodesKey = meshKey(store.nodes);
  const shownKey = useRef<string | null>(null);
  const meshHolder = mesh.holder;

  useEffect(() => {
    if (!canView || !store.isLoaded) return;
    if (shownKey.current !== null && shownKey.current !== nodesKey) {
      void meshHolder.refresh();
    }
    shownKey.current = nodesKey;
  }, [canView, store.isLoaded, nodesKey, meshHolder]);

  /** Последняя нагрузка узла: событие `node:load` или метрики агента из списка. */
  const loadOf = (node: NodeDto): IAgentMetricsPointDto | null => {
    const live = store.loadOf(node.id);
    const agent = node.agentId ? agents.byId(node.agentId) : undefined;
    const fromAgent = agent?.metrics;
    const fromEvent =
      live && live.agentId === node.agentId ? live.point : undefined;

    if (fromEvent && (!fromAgent || fromEvent.at >= fromAgent.at)) {
      return fromEvent;
    }

    return fromAgent ?? null;
  };

  useCloseWhenForbidden(
    form.open,
    form.editing ? accessOf(form.editing).canUpdate : canCreate,
    () => form.setOpen(false),
  );
  useCloseWhenForbidden(
    !!owner.node,
    !!owner.node && accessOf(owner.node).canAssign,
    owner.close,
  );
  useCloseWhenForbidden(
    !!provision.node,
    !!provision.node && accessOf(provision.node).canProvision,
    provision.close,
  );

  return {
    nodes: filterNodes(store.nodes, filter, userStore.user?.id ?? null),
    total: store.nodes.length,
    isLoading: store.isLoading,
    error: store.error,
    filter,
    setQuery: (query: string) => setFilter(prev => ({ ...prev, query })),
    setMine: (mine: boolean) => setFilter(prev => ({ ...prev, mine })),
    mesh: mesh.data,
    /** Нагрузка узла для колонки: последняя точка метрик его агента. */
    loadOf,
    form,
    remove,
    owner,
    provision,
    canCreate,
    /** Право на просмотр узлов хотя бы своих — для `PermissionGate`. */
    viewPermission: ownPermission(NODE_PERMISSIONS.VIEW),
    accessOf,
    /** Меняется вместе с правами — колонки таблицы пересобираются по нему. */
    accessKey: userStore.accessKey,
  };
};

export type NodesVM = ReturnType<typeof useNodesVM>;
