import { IAuthStore } from "@auth/store";
import { createDisposer } from "@di";
import { ISocketTransport } from "@lib/socket";
import { IUserRealtime } from "@user/store";
import { makeAutoObservable, reaction } from "mobx";

import { router } from "../../router";
import { IAppDataStore } from "./AppData.types";

@IAppDataStore({ inSingleton: true })
export class AppDataStore implements IAppDataStore {
  constructor(
    @IAuthStore() private _authStore: IAuthStore,
    @ISocketTransport() private _socketTransport: ISocketTransport,
    @IUserRealtime() private _userRealtime: IUserRealtime,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  initialize() {
    const disposers = createDisposer();

    return [
      reaction(
        () => this._authStore.isAuthenticated,
        isAuthenticated => {
          if (isAuthenticated) {
            disposers.add(
              this._socketTransport.initialize(),
              this._userRealtime.initialize(),
            );
          } else {
            disposers.dispose();

            router.navigate({ to: "/sign-in" });
          }
        },
      ),
      disposers.dispose,
    ];
  }
}
