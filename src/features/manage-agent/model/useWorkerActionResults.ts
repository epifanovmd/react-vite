import { type IAgentActionEvent, IAgentsStore } from "@entities/agent";
import { INotificationService } from "@shared/lib/notifications";
import { useSocketEvent } from "@shared/lib/socket";

const WORKER_ACTIONS: Record<string, { done: string; failed: string }> = {
  "worker.restart": { done: "перезапущен", failed: "не перезапущен" },
  "worker.update": { done: "обновлён", failed: "не обновлён" },
};

/** Имя воркера в аргументах действия (`args.name`). */
const workerOfEvent = (event: IAgentActionEvent): string | null =>
  typeof event.args?.name === "string" ? event.args.name : null;

const versionOf = (result: unknown): string | null =>
  typeof result === "object" &&
  result !== null &&
  "version" in result &&
  typeof result.version === "string"
    ? result.version
    : null;

/**
 * Итоги отложенных замен воркеров агента (`agent:action` с `deferred`):
 * тост, снятие ожидания и свежая карточка агента. Сокет должен быть в
 * комнате агента — её держит страница.
 */
export const useWorkerActionResults = (agentId: string | null): void => {
  const store = IAgentsStore.useInstance();
  const toast = INotificationService.useInstance();

  useSocketEvent<[IAgentActionEvent]>(
    "agent:action",
    event => {
      const texts = WORKER_ACTIONS[event.name];

      if (event.agentId !== agentId || !event.deferred || !texts) return;

      const tracked = store.settleDeferred(event.id);
      const worker = workerOfEvent(event) ?? tracked?.worker ?? "?";

      if (event.status === "done") {
        const version = versionOf(event.result);

        toast.success(
          `Воркер «${worker}» ${texts.done}${version ? `: версия ${version}` : ""}`,
        );
      } else {
        toast.error(event.error?.message ?? "Агент не выполнил замену", {
          title: `Воркер «${worker}» ${texts.failed}`,
        });
      }
      void store.fetch(event.agentId);
    },
    !!agentId,
  );
};
