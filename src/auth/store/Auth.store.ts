import { ITokensDto, TSignUpRequestDto } from "@api/gen/model";
import { IAuthApiService } from "@auth/services";
import { IAuthSessionService } from "@auth/services";
import { createEnumModelBase } from "@models";
import { makeAutoObservable } from "mobx";

import { AuthStatus, IAuthStore } from "./Auth.types";

const AuthStatusModel = createEnumModelBase<typeof AuthStatus>(AuthStatus);

/**
 * Стор **аутентификации и сессии**: состояние и триггеры.
 * Бизнес-логика (API-вызовы, сохранение токенов, сидирование юзера)
 * делегирована `IAuthApiService`.
 */
@IAuthStore({ inSingleton: true })
class AuthStore implements IAuthStore {
  private statusModel = new AuthStatusModel(() => this.status);
  public status = AuthStatus.Idle;

  public twoFactorToken: string | null = null;
  public twoFactorHint?: string;
  public verifyError?: string;

  constructor(
    @IAuthApiService() private _authApi: IAuthApiService,
    @IAuthSessionService() private _session: IAuthSessionService,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });

    // При форсированном завершении сессии (refresh не удался) — signOut
    this._session.onSessionExpired(() => this.signOut());
  }

  get error() {
    return this.verifyError ?? undefined;
  }

  get isTwoFactorRequired() {
    return this.twoFactorToken !== null;
  }

  get isIdle() {
    return this.statusModel.isIdle;
  }

  get isAuthenticated() {
    return this.statusModel.isAuthenticated;
  }

  get isLoading() {
    return this.statusModel.isLoading;
  }

  get isReady() {
    return !this.isIdle && !this.isLoading;
  }

  async signIn(params: { login: string; password: string }) {
    this._setStatus(AuthStatus.Loading);
    this.twoFactorToken = null;
    this.twoFactorHint = undefined;
    this.verifyError = undefined;

    const result = await this._authApi.signIn(params);

    if ("require2FA" in result) {
      this.twoFactorToken = result.twoFactorToken;
      this.twoFactorHint = result.twoFactorHint;
      this._setStatus(AuthStatus.Unauthenticated);

      return;
    }

    if ("error" in result) {
      this.verifyError = result.error;
      this._setStatus(AuthStatus.Unauthenticated);

      return;
    }

    this._setStatus(AuthStatus.Authenticated);
  }

  async verify2FA(password: string) {
    if (!this.twoFactorToken) return;

    this._setStatus(AuthStatus.Loading);
    this.verifyError = undefined;

    const result = await this._authApi.verify2FA(password);

    if ("error" in result) {
      this.verifyError = result.error;
      this._setStatus(AuthStatus.Unauthenticated);

      return;
    }

    this.twoFactorToken = null;
    this.twoFactorHint = undefined;
    this._setStatus(AuthStatus.Authenticated);
  }

  async signUp(params: TSignUpRequestDto) {
    this._setStatus(AuthStatus.Loading);

    const result = await this._authApi.signUp(params);

    if ("error" in result) {
      this._setStatus(AuthStatus.Unauthenticated);

      return;
    }

    this._setStatus(AuthStatus.Authenticated);
  }

  async restore(tokens?: ITokensDto) {
    this._setStatus(AuthStatus.Loading);

    const ok = await this._authApi.restore(tokens);

    this._setStatus(ok ? AuthStatus.Authenticated : AuthStatus.Unauthenticated);
  }

  signOut() {
    this._session.clearTokens();
    this._authApi.reset();
    this.twoFactorToken = null;
    this.twoFactorHint = undefined;
    this.verifyError = undefined;
    this._setStatus(AuthStatus.Unauthenticated);
  }

  private _setStatus(status: AuthStatus) {
    this.status = status;
  }
}

export { AuthStore };
