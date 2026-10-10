import {
  AGENT_PERMISSIONS,
  IAgentsStore,
  useAgentReleaseWatch,
} from "@entities/agent";
import { IUserStore } from "@entities/user";
import { INotificationService } from "@shared/lib/notifications";
import { useState } from "react";

import { NAV_GROUPS } from "./constants";

/**
 * Шапка: профиль и разделы по правам. Сборки агента отслеживаются всю сессию:
 * у раздела агентов — значок с числом доступных обновлений, новая версия —
 * уведомление.
 */
export const useHeaderVM = () => {
  const userStore = IUserStore.useInstance();
  const agents = IAgentsStore.useInstance();
  const toast = INotificationService.useInstance();
  const { user, model } = userStore;
  const [mobileOpen, setMobileOpen] = useState(false);
  const canAgents = userStore.can(AGENT_PERMISSIONS.VIEW);

  useAgentReleaseWatch(canAgents, {
    onRelease: event => {
      // Без прежней версии сборки просто получены впервые после запуска сервера.
      if (!event.previous) return;
      toast.info(`Агентов можно обновить до версии ${event.version}.`, {
        title: "Новая версия агента",
      });
    },
    onAgentUpdate: candidate =>
      toast.info(
        `Агент «${candidate.name}» нашёл версию ${candidate.target} (сейчас ${candidate.current}).`,
        { title: "Новая версия агента" },
      ),
  });

  const release = agents.release;
  const updates = release
    ? release.candidates.length + release.workerCandidates.length
    : 0;

  const displayName = model?.displayName ?? "Admin";
  const initials = model?.initials ?? "A";

  const subtitle =
    user?.email ??
    user?.phone ??
    (user?.username ? `@${user.username}` : undefined);

  const visibleGroups = NAV_GROUPS.map(group => ({
    ...group,
    items: group.items
      .filter(
        item =>
          !item.permission ||
          [item.permission]
            .flat()
            .some(permission => userStore.can(permission)),
      )
      .map(item =>
        item.to === "/agents" && updates > 0
          ? { ...item, badge: updates }
          : item,
      ),
  })).filter(group => group.items.length > 0);

  return {
    displayName,
    initials,
    avatarUrl: userStore.avatarUrl,
    subtitle,
    visibleGroups,
    mobileOpen,
    setMobileOpen,
  };
};
