import { makeAutoObservable } from "mobx";

import { ITokenService } from "./Token.types";

@ITokenService({ inSingleton: true })
export class TokenService implements ITokenService {
  public token = "";
  public refreshToken = "";

  constructor() {
    this.restoreRefreshToken().then();

    makeAutoObservable(this, {}, { autoBind: true });
  }

  setTokens(accessToken: string, refreshToken: string) {
    this.token = accessToken;

    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken);
    } else {
      this.clear();
    }
    this.refreshToken = refreshToken;
  }

  async restoreRefreshToken() {
    const token = await new Promise<string | null>(resolve =>
      resolve(localStorage.getItem("refresh_token")),
    ).then(res => res ?? "");

    this.setTokens(this.token, token);

    return token;
  }

  clear() {
    this.token = "";

    localStorage.removeItem("refresh_token");
    this.refreshToken = "";
  }
}
