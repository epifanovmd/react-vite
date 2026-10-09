import { configuredWorkers, useAgentEventFeed } from "@entities/agent";
import { IMainApi } from "@shared/api";
import type { AgentDto, IAgentEventDto } from "@shared/api/gen/main/model";
import { useSocketEvent, useSocketRoom } from "@shared/lib/socket";
import { useState } from "react";

/**
 * События воркеров агента, новые первыми: страницы с сервера по курсору (с
 * фильтром по воркеру и типу), новые — `agent:event` из комнаты агента.
 */
export const useAgentEventsVM = (agent: AgentDto) => {
  const api = IMainApi.useInstance();
  const [worker, setWorker] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const key = `${agent.id}/${worker ?? ""}/${type ?? ""}`;

  const feed = useAgentEventFeed(
    (cursor, limit) =>
      api.getAgentEvents({
        agentId: agent.id,
        worker: worker ?? undefined,
        type: type ?? undefined,
        cursor,
        limit,
      }),
    key,
  );

  useSocketRoom("agent", agent.id, () => void feed.load());
  useSocketEvent<[IAgentEventDto]>("agent:event", event => {
    if (
      event.agentId === agent.id &&
      (!worker || event.worker === worker) &&
      (!type || event.type === type)
    ) {
      feed.prepend(event);
    }
  });

  const workers = configuredWorkers(agent);
  // Типы — из манифестов: выбранного воркера или всех.
  const types = [
    ...new Set(
      workers
        .filter(item => !worker || item.name === worker)
        .flatMap(item => item.manifest?.events ?? [])
        .map(event => event.type),
    ),
  ].sort();

  return {
    feed,
    worker,
    setWorker: (next: string | null) => {
      setWorker(next);
      setType(null);
    },
    type,
    setType,
    workerOptions: workers.map(item => item.name),
    typeOptions: types,
  };
};

export type AgentEventsVM = ReturnType<typeof useAgentEventsVM>;
