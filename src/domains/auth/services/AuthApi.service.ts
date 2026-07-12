import { IApiService } from "@api";
import {
  I2FARequiredDto,
  ISignInRequestDto,
  ISignInResponseDto,
  ITokensDto,
  IUserWithTokensDto,
  TSignUpRequestDto,
} from "@api/gen/model";
import { EntityHolder } from "@store/holders";
import { IUserStore } from "@user/store";

import { IAuthSessionService } from "./Auth.types";
import { type AuthResult,IAuthApiService } from "./AuthApi.types";

@IAuthApiService({ inSingleton: true })
export class AuthApiService implements IAuthApiService {
  private _signHolder = new EntityHolder<ISignInResponseDto, ISignInRequestDto>();
  private _signUpHolder = new EntityHolder<IUserWithTokensDto>();
  private _twoFactorToken: string | null = null;
  private _twoFactorHint?: string;

  constructor(
    @IApiService() private _api: IApiService,
    @IAuthSessionService() private _session: IAuthSessionService,
    @IUserStore() private _user: IUserStore,
  ) {}

  get twoFactorToken(): string | null {
    return this._twoFactorToken;
  }

  get twoFactorHint(): string | undefined {
    return this._twoFactorHint;
  }

  async signIn(params: ISignInRequestDto): Promise<AuthResult> {
    this._twoFactorToken = null;
    this._twoFactorHint = undefined;

    const res = await this._signHolder.fromApi(() => this._api.signIn(params));

    if (res.error) return { error: res.error.message };

    if (res.data) {
      if (this._isTwoFactorResponse(res.data)) {
        this._twoFactorToken = res.data.twoFactorToken;
        this._twoFactorHint = res.data.twoFactorHint;

        return res.data;
      }

      const { tokens, ...userDto } = res.data;

      this._session.setTokens(tokens.accessToken, tokens.refreshToken);
      this._user.seed(userDto);
      await this._user.load();

      return { success: true };
    }

    return { error: "Unknown error" };
  }

  async verify2FA(password: string): Promise<AuthResult> {
    if (!this._twoFactorToken) return { error: "2FA not in progress" };

    const res = await this._api.verify2FA({
      twoFactorToken: this._twoFactorToken,
      password,
    });

    if (res.error) return { error: res.error.message };

    if (res.data) {
      const { tokens, ...userDto } = res.data;

      this._session.setTokens(tokens.accessToken, tokens.refreshToken);
      this._user.seed(userDto);
      this._twoFactorToken = null;
      this._twoFactorHint = undefined;
      await this._user.load();

      return { success: true };
    }

    return { error: "Unknown error" };
  }

  async signUp(params: TSignUpRequestDto): Promise<AuthResult> {
    const res = await this._signUpHolder.fromApi(() =>
      this._api.signUp(params),
    );

    if (res.error) return { error: res.error.message };

    if (res.data) {
      const { tokens, ...userDto } = res.data;

      this._session.setTokens(tokens.accessToken, tokens.refreshToken);
      this._user.seed(userDto);

      return { success: true };
    }

    return { error: "Unknown error" };
  }

  async restore(tokens?: ITokensDto): Promise<boolean> {
    if (tokens) {
      this._session.setTokens(tokens.accessToken, tokens.refreshToken);
    } else {
      const ok = await this._session.restoreSession();

      if (!ok) return false;
    }

    const { data } = await this._user.load();

    return !!data;
  }

  reset(): void {
    this._signHolder.reset();
    this._signUpHolder.reset();
    this._twoFactorToken = null;
    this._twoFactorHint = undefined;
  }

  private _isTwoFactorResponse(
    data: ISignInResponseDto,
  ): data is I2FARequiredDto {
    return (data as I2FARequiredDto).require2FA === true;
  }
}
