import { IApiService } from "@api";
import {
  I2FARequiredDto,
  ISignInRequestDto,
  ISignInResponseDto,
  ITokensDto,
  IUserWithTokensDto,
  TSignUpRequestDto,
} from "@api/gen/model";
import { IAuthSessionService } from "@auth/services";
import { createEnumModelBase } from "@models";
import { EntityHolder } from "@store/holders";
import { IUserStore } from "@user/store";
import { makeAutoObservable } from "mobx";

import { AuthStatus, IAuthStore } from "./Auth.types";

const AuthStatusModel = createEnumModelBase<typeof AuthStatus>(AuthStatus);

/**
 * Стор **аутентификации и сессии**: вход, регистрация, 2FA, восстановление
 * сессии и статус. Доменными данными пользователя (профиль, роли, permissions)
 * владеет `IUserStore` — сюда они намеренно не входят.
 */
@IAuthStore({ inSingleton: true })
class AuthStore implements IAuthStore {
  private statusModel = new AuthStatusModel(() => this.status);
  public status = AuthStatus.Idle;

  private _signHolder = new EntityHolder<
    ISignInResponseDto,
    ISignInRequestDto
  >();
  private _signUpHolder = new EntityHolder<IUserWithTokensDto>();

  /** Токен второго фактора (выдаётся сервером, когда требуется 2FA). */
  public twoFactorToken: string | null = null;
  public twoFactorHint?: string;
  public verifyError?: string;

  constructor(
    @IApiService() private _api: IApiService,
    @IAuthSessionService() private _session: IAuthSessionService,
    @IUserStore() private _user: IUserStore,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get error() {
    return (
      this.verifyError ??
      this._signHolder.error?.message ??
      this._signUpHolder.error?.message
    );
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

  async signIn(params: ISignInRequestDto) {
    this._setStatus(AuthStatus.Loading);
    this.twoFactorToken = null;
    this.twoFactorHint = undefined;
    this.verifyError = undefined;

    const res = await this._signHolder.fromApi(() => this._api.signIn(params));

    if (res.error) {
      this._setStatus(AuthStatus.Unauthenticated);

      return;
    }

    if (res.data) {
      if (this._isTwoFactorResponse(res.data)) {
        this.twoFactorToken = res.data.twoFactorToken;
        this.twoFactorHint = res.data.twoFactorHint;
        this._setStatus(AuthStatus.Unauthenticated);

        return;
      }

      const { tokens, ...userDto } = res.data;

      this._session.setTokens(tokens.accessToken, tokens.refreshToken);
      this._user.seed(userDto);
      await this._user.load();
      this._setStatus(AuthStatus.Authenticated);
    }
  }

  async verify2FA(password: string) {
    if (!this.twoFactorToken) {
      return;
    }

    this._setStatus(AuthStatus.Loading);
    this.verifyError = undefined;

    const res = await this._api.verify2FA({
      twoFactorToken: this.twoFactorToken,
      password,
    });

    if (res.error) {
      this.verifyError = res.error.message;
      this._setStatus(AuthStatus.Unauthenticated);

      return;
    }

    if (res.data) {
      const { tokens, ...userDto } = res.data;

      this._session.setTokens(tokens.accessToken, tokens.refreshToken);
      this._user.seed(userDto);
      this.twoFactorToken = null;
      this.twoFactorHint = undefined;
      await this._user.load();
      this._setStatus(AuthStatus.Authenticated);
    }
  }

  private _isTwoFactorResponse(
    data: ISignInResponseDto,
  ): data is I2FARequiredDto {
    return (data as I2FARequiredDto).require2FA === true;
  }

  async signUp(params: TSignUpRequestDto) {
    this._setStatus(AuthStatus.Loading);

    const res = await this._signUpHolder.fromApi(() =>
      this._api.signUp(params),
    );

    if (res.error) {
      this._setStatus(AuthStatus.Unauthenticated);

      return;
    }

    if (res.data) {
      const { tokens, ...userDto } = res.data;

      this._session.setTokens(tokens.accessToken, tokens.refreshToken);
      this._user.seed(userDto);
      this._setStatus(AuthStatus.Authenticated);
    }
  }

  async restore(tokens?: ITokensDto) {
    this._setStatus(AuthStatus.Loading);

    if (tokens) {
      this._session.setTokens(tokens.accessToken, tokens.refreshToken);
    } else {
      const ok = await this._session.restoreSession();

      if (!ok) {
        this._setStatus(AuthStatus.Unauthenticated);

        return;
      }
    }

    const { data } = await this._user.load();

    this._setStatus(
      data ? AuthStatus.Authenticated : AuthStatus.Unauthenticated,
    );
  }

  signOut() {
    this._session.clearTokens();
    this._user.reset();
    this._signHolder.reset();
    this._signUpHolder.reset();
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
