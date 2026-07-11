import { IStorageService } from "@lib/storage";
import { makeAutoObservable } from "mobx";

import { IAuthTokenStorage } from "./Auth.types";

const REFRESH_TOKEN_KEY = "app:refresh_token";

@IAuthTokenStorage({ inSingleton: true })
export class AuthTokenStorage implements IAuthTokenStorage {
  public accessToken = "";
  public refreshToken = "";

  constructor(@IStorageService() private _storage: IStorageService) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  isTokenExpiringSoon(bufferSeconds = 60): boolean {
    if (!this.accessToken) return true;
    try {
      const payload = JSON.parse(atob(this.accessToken.split(".")[1]));

      return Date.now() / 1000 > payload.exp - bufferSeconds;
    } catch {
      return true;
    }
  }

  setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;

    if (refreshToken) {
      this._storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } else {
      this._storage.removeItem(REFRESH_TOKEN_KEY);
    }
  }

  restoreRefreshToken(): string | null {
    const token = this._storage.getItem(REFRESH_TOKEN_KEY);

    if (token) {
      this.refreshToken = token;
    }

    return token;
  }

  clear(): void {
    this.accessToken = "";
    this.refreshToken = "";
    this._storage.removeItem(REFRESH_TOKEN_KEY);
  }
}
