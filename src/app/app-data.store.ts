import { IAgentsStore } from "@entities/agent";
import { IAuthStore } from "@entities/auth";
import { IJobRealtime, IJobStore } from "@entities/job";
import { INodesStore } from "@entities/node";
import { ISessionStore, IUserRealtime, IUserStore } from "@entities/user";
import { createDisposer, type Disposer } from "@shared/lib/di";
import { ISocketTransport } from "@shared/lib/socket";
import { injectable } from "inversify";
import { makeAutoObservable, reaction } from "mobx";

import { IAppDataStore } from "./app-data.types";
import { router } from "./router";

@injectable()
export class AppDataStore implements IAppDataStore {
  isRestored = false;

  constructor(
    @IAuthStore() private _authStore: IAuthStore,
    @ISocketTransport() private _socketTransport: ISocketTransport,
    @IUserRealtime() private _userRealtime: IUserRealtime,
    @IUserStore() private _userStore: IUserStore,
    @ISessionStore() private _sessionStore: ISessionStore,
    @IJobRealtime() private _jobRealtime: IJobRealtime,
    @IJobStore() private _jobStore: IJobStore,
    @IAgentsStore() private _agentsStore: IAgentsStore,
    @INodesStore() private _nodesStore: INodesStore,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  initialize() {
    const disposers = createDisposer();

    if (this._authStore.isIdle) {
      this._authStore.restore().finally(this._markRestored);
    } else {
      this._markRestored();
    }

    if (this._authStore.isAuthenticated) this._startSession(disposers);

    return [
      reaction(
        () => this._authStore.isAuthenticated,
        isAuthenticated => {
          if (isAuthenticated) {
            this._startSession(disposers);
          } else {
            this._endSession(disposers);
          }
        },
      ),
      disposers.dispose,
    ];
  }

  /** Вход: профиль, сокет и realtime-подписки живут до выхода или dispose. */
  private _startSession(disposers: Disposer) {
    this._userStore.load();

    disposers.add(
      this._socketTransport.initialize(),
      this._userRealtime.initialize(),
      this._jobRealtime.initialize(),
    );
  }

  /** Выход: данные прежнего пользователя не переживают его — следующий вход может быть другим человеком. */
  private _endSession(disposers: Disposer) {
    disposers.dispose();
    this._userStore.reset();
    this._sessionStore.reset();
    this._jobStore.reset();
    this._agentsStore.reset();
    this._nodesStore.reset();

    router.navigate({ to: "/sign-in" });
  }

  private _markRestored() {
    this.isRestored = true;
  }
}
