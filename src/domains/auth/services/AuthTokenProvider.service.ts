import { ITokenProvider } from "@lib/socket/contract/TokenProvider.types";
import { reaction } from "mobx";

import { IAuthSessionService } from "./Auth.types";

@ITokenProvider({ inSingleton: true })
export class AuthTokenProvider implements ITokenProvider {
  constructor(
    @IAuthSessionService() private _session: IAuthSessionService,
  ) {}

  get accessToken(): string {
    return this._session.accessToken;
  }

  refreshToken(): Promise<void> {
    return this._session.refreshToken();
  }

  restoreSession(): Promise<boolean> {
    return this._session.restoreSession();
  }

  onTokenChange(cb: (token: string) => void): () => void {
    return reaction(
      () => this._session.accessToken,
      token => {
        if (token) cb(token);
      },
      { fireImmediately: true },
    );
  }
}
