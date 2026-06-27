import { IUserSocketService } from "@core/socket";

import { IUserRealtime, IUserStore } from "./User.types";

@IUserRealtime({ inSingleton: true })
export class UserRealtime implements IUserRealtime {
  constructor(
    @IUserSocketService() private _userSocket: IUserSocketService,
    @IUserStore() private _userStore: IUserStore,
  ) {}

  initialize() {
    return this._userSocket.subscribe({
      onProfileUpdated: profile => {
        if (profile.userId !== this._userStore.user?.id) return;
        this._userStore.patchProfile(profile);
      },
      onUsernameChanged: ({ username }) => {
        this._userStore.patchUser({ username });
      },
      onEmailVerified: ({ verified }) => {
        this._userStore.patchUser({ emailVerified: verified });
      },
      onPrivilegesChanged: () => {
        this._userStore.refresh();
      },
    });
  }
}
