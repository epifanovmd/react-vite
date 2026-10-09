import type { AgentAlertDto, AgentDto } from "@shared/api/gen/main/model";
import { useSocketEvent, useSocketRoom } from "@shared/lib/socket";

import { IAgentsStore } from "./types";

/**
 * Комната `agents`: изменения агентов и их проблем попадают в стор. После
 * переподключения события за время обрыва потеряны — список, проблемы и
 * сборки перечитываются.
 */
export const useAgentsRealtime = (enabled: boolean): void => {
  const store = IAgentsStore.useInstance();

  useSocketRoom("agents", enabled ? "all" : null, () => {
    void store.load();
    void store.loadAlerts();
    void store.loadRelease();
  });
  useSocketEvent<[AgentDto]>("agent:updated", store.upsert, enabled);
  useSocketEvent<[{ id: string }]>(
    "agent:deleted",
    ({ id }) => store.remove(id),
    enabled,
  );
  useSocketEvent<[AgentAlertDto]>("agent:alert", store.applyAlert, enabled);
};
