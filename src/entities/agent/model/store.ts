import { IMainApi } from "@shared/api";
import type {
  AgentAlertDto,
  AgentDto,
  IAgentReleaseDto,
} from "@shared/api/gen/main/model";
import { CollectionHolder, EntityHolder } from "@shared/lib/holders";
import { injectable } from "inversify";
import { makeAutoObservable, observable } from "mobx";

import {
  agentVersion,
  alertKey,
  onlineAgentFirst,
  workerOf,
} from "../lib/agent";
import { IAgentsStore, type IDeferredWorkerAction } from "./types";

/** Отложенная замена и видел ли её агент в своём статусе (`pending`). */
interface IDeferredEntry {
  action: IDeferredWorkerAction;
  seen: boolean;
}

/** Агентов немного — одним списком (больше сервер не отдаёт за раз). */
const AGENTS_LIMIT = 100;

const versionsOf = (agent: AgentDto): string =>
  [
    agentVersion(agent),
    ...agent.workers.map(w => `${w.name}@${w.version ?? ""}`),
  ].join(",");

@injectable()
export class AgentsStore implements IAgentsStore {
  private _list = new CollectionHolder<AgentDto>({
    onFetch: async () => {
      const { data, error } = await this._api.getAgents({
        limit: AGENTS_LIMIT,
      });

      return { data: data?.items ?? null, error };
    },
    keyExtractor: agent => agent.id,
  });

  private _alerts = new CollectionHolder<AgentAlertDto>({
    onFetch: () => this._api.getAgentAlerts(),
    keyExtractor: alertKey,
  });

  private _release = new EntityHolder<IAgentReleaseDto>({
    onFetch: () => this._api.getAgentRelease(),
  });

  private _deferred = observable.map<string, IDeferredEntry>();

  constructor(@IMainApi() private _api: IMainApi) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get agents() {
    return [...this._list.items].sort(onlineAgentFirst);
  }

  get isLoading() {
    return this._list.isLoading;
  }

  get error() {
    return this._list.error;
  }

  get alerts() {
    return [...this._alerts.items].sort((a, b) => b.since - a.since);
  }

  get release() {
    return this._release.data;
  }

  async load() {
    if (this._list.isSuccess) {
      await this._list.refresh();
    } else {
      await this._list.load();
    }
  }

  async loadAlerts() {
    if (this._alerts.isSuccess) {
      await this._alerts.refresh();
    } else {
      await this._alerts.load();
    }
  }

  async loadRelease() {
    if (this._release.isFilled) {
      await this._release.refresh();
    } else {
      await this._release.load();
    }
  }

  async fetch(id: string) {
    const { data, error } = await this._api.getAgent(id);

    if (data) this.upsert(data);

    return { error: error ?? null };
  }

  byId(id: string) {
    return this._list.get(id);
  }

  alertsOf(agentId: string) {
    return this.alerts.filter(alert => alert.agentId === agentId);
  }

  updateCandidate(agentId: string) {
    const agent = this.byId(agentId);
    const candidate = this._release.data?.candidates.find(
      c => c.agentId === agentId,
    );

    // Выпуск мог устареть: агент уже обновился, а выпуск ещё не перечитан.
    if (!candidate || (agent && agentVersion(agent) === candidate.target)) {
      return null;
    }

    return candidate;
  }

  workerCandidate(agentId: string, worker: string) {
    const agent = this.byId(agentId);
    const current = agent ? workerOf(agent, worker) : undefined;
    const candidate = this._release.data?.workerCandidates.find(
      c => c.agentId === agentId && c.worker === worker,
    );

    if (!candidate || current?.version === candidate.target) return null;

    return candidate;
  }

  upsert(agent: AgentDto) {
    const before = this.byId(agent.id);

    this._list.upsertItem(agent.id, agent);
    this._pruneDeferred(agent);

    // Сменилась версия агента или воркеров — кандидаты на обновление другие.
    if (
      before &&
      this._release.isFilled &&
      versionsOf(before) !== versionsOf(agent)
    ) {
      void this.loadRelease();
    }
  }

  remove(id: string) {
    this._list.removeItem(id);
    this._alerts.removeItem(alert => alert.agentId === id);
  }

  applyAlert(alert: AgentAlertDto) {
    if (alert.active === false) {
      this._alerts.removeItem(alertKey(alert));
    } else {
      this._alerts.upsertItem(alertKey(alert), alert);
    }
  }

  trackDeferred(action: IDeferredWorkerAction) {
    this._deferred.set(action.actionId, { action, seen: false });
  }

  settleDeferred(actionId: string) {
    const entry = this._deferred.get(actionId);

    this._deferred.delete(actionId);

    return entry?.action;
  }

  deferredOf(agentId: string, worker: string) {
    for (const { action } of this._deferred.values()) {
      if (action.agentId === agentId && action.worker === worker) {
        return action;
      }
    }

    return undefined;
  }

  /**
   * Итог замены мог потеряться (обрыв сокета): ожидание снимается, когда
   * агент сначала показал замену в статусе, а потом перестал.
   */
  private _pruneDeferred(agent: AgentDto) {
    for (const [id, entry] of this._deferred) {
      if (entry.action.agentId !== agent.id) continue;

      const pending = workerOf(agent, entry.action.worker)?.pending;

      if (pending) entry.seen = true;
      else if (entry.seen) this._deferred.delete(id);
    }
  }

  reset() {
    this._deferred.clear();
    this._list.reset();
    this._alerts.reset();
    this._release.reset();
  }
}
