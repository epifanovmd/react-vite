import {
  AGENT_PERMISSIONS,
  IAgentsStore,
  useAgentsRealtime,
} from "@entities/agent";
import {
  countNodes,
  INodesStore,
  NODE_PERMISSIONS,
  useNodesRealtime,
} from "@entities/node";
import { IUserStore } from "@entities/user";
import { useEffect } from "react";

/** Сколько узлов с проблемами показывать на главной. */
const TROUBLED_LIMIT = 5;

/**
 * Главная: сводка по узлам, узлы, которым нужно внимание, и (с правом на
 * агентов) текущие проблемы агентов. Без права на узлы показывать нечего —
 * страница уводит в профиль.
 */
export const useHomeVM = () => {
  const userStore = IUserStore.useInstance();
  const store = INodesStore.useInstance();
  const agents = IAgentsStore.useInstance();
  const scope = userStore.scope(NODE_PERMISSIONS.VIEW);
  const canViewNodes = scope !== null;
  const canViewAgents = userStore.can(AGENT_PERMISSIONS.VIEW);

  useEffect(() => {
    if (canViewNodes) void store.load();
  }, [canViewNodes, store]);
  useEffect(() => {
    if (canViewAgents) void agents.loadAlerts();
  }, [canViewAgents, agents]);
  useNodesRealtime(scope);
  useAgentsRealtime(canViewAgents);

  return {
    /** Права уже известны: можно решать, куда вести. */
    isReady: userStore.isReady,
    canViewNodes,
    counts: countNodes(store.nodes),
    isLoading: store.isLoading && !store.isLoaded,
    troubled: store.nodes
      .filter(node => node.status === "error" || node.status === "offline")
      .slice(0, TROUBLED_LIMIT),
    /** Проблемы агентов; без права на агентов — пусто. */
    alerts: canViewAgents ? agents.alerts : [],
  };
};

export type HomeVM = ReturnType<typeof useHomeVM>;
