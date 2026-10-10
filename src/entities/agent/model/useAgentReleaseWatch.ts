import type { IAgentUpdateCandidateDto } from "@shared/api/gen/main/model";
import { useSocketEvent, useSocketRoom } from "@shared/lib/socket";
import { reaction } from "mobx";
import { useEffect, useRef } from "react";

import { IAgentReleaseEvent, IAgentsStore } from "./types";

interface IAgentReleaseWatchHandlers {
  /** `agent:release`: там, откуда сервер берёт сборки агента, другая версия. */
  onRelease?: (event: IAgentReleaseEvent) => void;
  /** Агент сам нашёл новую версию в своём каталоге сборок (за время сессии). */
  onAgentUpdate?: (candidate: IAgentUpdateCandidateDto) => void;
}

const agentFound = (candidates: IAgentUpdateCandidateDto[]) =>
  new Map(
    candidates
      .filter(c => c.source === "agent")
      .map(c => [`${c.agentId}@${c.target}`, c]),
  );

/**
 * Сборки агента на всё время сессии: кого можно обновить. Новая версия у сервера
 * приходит событием `agent:release`, новая версия, найденная самим агентом, — в
 * `agent:updated` (сборки перечитывает стор). Уже известные при открытии
 * обновления — без `onAgentUpdate`: их видно по значку.
 */
export const useAgentReleaseWatch = (
  enabled: boolean,
  { onRelease, onAgentUpdate }: IAgentReleaseWatchHandlers = {},
): void => {
  const store = IAgentsStore.useInstance();
  const notify = useRef(onAgentUpdate);

  notify.current = onAgentUpdate;

  useEffect(() => {
    if (!enabled) return undefined;
    void store.loadRelease();
    let known: Set<string> | null = null;

    return reaction(
      () => store.release?.candidates,
      candidates => {
        if (!candidates) return;
        const found = agentFound(candidates);

        if (known) {
          for (const [key, candidate] of found) {
            if (!known.has(key)) notify.current?.(candidate);
          }
        }
        known = new Set(found.keys());
      },
      { fireImmediately: true },
    );
  }, [enabled, store]);

  useSocketRoom("agents", enabled ? "all" : null, () => {
    void store.loadRelease();
  });
  useSocketEvent<[IAgentReleaseEvent]>(
    "agent:release",
    event => {
      void store.loadRelease();
      onRelease?.(event);
    },
    enabled,
  );
};
