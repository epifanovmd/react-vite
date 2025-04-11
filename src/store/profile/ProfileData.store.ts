import { ApiError, IApiService } from "@api";
import {
  ERole,
  IProfileDto,
  IProfileWithTokensDto,
  ISignInRequest,
  TSignUpRequest,
} from "@api/api-gen/data-contracts.ts";
import { ApiResponse, DataHolder } from "@force-dev/utils";
import { ITokenService } from "@service";
import { makeAutoObservable } from "mobx";

import { IProfileDataStore } from "./ProfileData.types";

@IProfileDataStore({ inSingleton: true })
class ProfileDataStore implements IProfileDataStore {
  public holder = new DataHolder<IProfileDto>();

  constructor(
    @IApiService() private _apiService: IApiService,
    @ITokenService() private _tokenService: ITokenService,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async updateToken() {
    const refreshToken = await this._tokenService.restoreRefreshToken();

    if (refreshToken) {
      await this._refresh(refreshToken);
    }

    return {
      accessToken: this._tokenService.accessToken,
      refreshToken: this._tokenService.refreshToken,
    };
  }

  get profile() {
    return this.holder.d;
  }

  get isLoading() {
    return this.holder.isLoading;
  }

  get isError() {
    return this.holder.isError;
  }

  get isEmpty() {
    return this.holder.isEmpty;
  }

  get isAdmin() {
    return this.holder.d?.role.name === ERole.Admin;
  }

  async signIn(params: ISignInRequest) {
    this.holder.setLoading();

    const res = await this._apiService.signIn(params);

    this._updateProfileHolder(res);
  }

  async signUp(params: TSignUpRequest) {
    this.holder.setLoading();

    const res = await this._apiService.signUp(params);

    this._updateProfileHolder(res);
  }

  async getProfile() {
    this.holder.setLoading();

    const res = await this._apiService.getMyProfile();

    if (res.error) {
      this.holder.setError({ msg: res.error.message });
    } else if (res.data) {
      this.holder.setData(res.data);

      return res.data;
    }

    return undefined;
  }

  private async _refresh(refreshToken: string) {
    const res = await this._apiService.refresh({ refreshToken });

    if (res.error) {
      this._tokenService.clear();
    } else if (res.data) {
      this._tokenService.setTokens(res.data.accessToken, res.data.refreshToken);
    }
  }

  private _updateProfileHolder(
    res: ApiResponse<IProfileWithTokensDto, ApiError>,
  ) {
    if (res.error) {
      this._tokenService.clear();
      this.holder.setError({ msg: res.error.message });
    } else if (res.data) {
      const { tokens, ...profile } = res.data;

      this.holder.setData(profile);
      this._tokenService.setTokens(tokens.accessToken, tokens.refreshToken);
    }
  }
}
