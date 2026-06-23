import { IApiService } from "@api";
import { SessionDto } from "@api/api-gen/data-contracts";
import { SessionModel } from "@models";
import { CollectionHolder } from "@store";
import { makeAutoObservable } from "mobx";

import { ISessionsStore } from "./Sessions.types";

@ISessionsStore({ inSingleton: true })
export class SessionsStore implements ISessionsStore {
  public sessionsHolder = new CollectionHolder<SessionDto>({
    keyExtractor: s => s.id,
    onFetch: () => this._api.getSessions(),
  });

  constructor(@IApiService() private _api: IApiService) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get models() {
    return this.sessionsHolder.items.map(s => new SessionModel(s));
  }

  get isLoading() {
    return this.sessionsHolder.isLoading;
  }

  async load() {
    await this.sessionsHolder.load();
  }

  async terminate(id: string) {
    const res = await this._api.terminateSession({ id });

    if (!res.error) {
      this.sessionsHolder.removeItem(id);

      return true;
    }

    return false;
  }

  async terminateOthers() {
    const res = await this._api.terminateOtherSessions();

    if (!res.error) {
      await this.sessionsHolder.refresh();

      return true;
    }

    return false;
  }
}
