import { IApiService } from "@api";
import {
  ApiResponseDto,
  UserDto,
} from "@api/api-gen/data-contracts";
import { MutationHolder } from "@store";
import { makeAutoObservable } from "mobx";

import { ISecurityStore } from "./Security.types";

@ISecurityStore({ inSingleton: true })
export class SecurityStore implements ISecurityStore {
  public changePasswordMutation = new MutationHolder<void, ApiResponseDto>();
  public setUsernameMutation = new MutationHolder<void, UserDto>();
  public verifyEmailMutation = new MutationHolder<void, boolean>();
  public twoFaMutation = new MutationHolder<void, ApiResponseDto>();

  constructor(@IApiService() private _api: IApiService) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  changePassword(password: string) {
    return this.changePasswordMutation.run(() =>
      this._api.changePassword({ password }),
    );
  }

  setUsername(username: string) {
    return this.setUsernameMutation.run(() =>
      this._api.setUsername({ username }),
    );
  }

  requestVerifyEmail() {
    return this.verifyEmailMutation.run(() => this._api.requestVerifyEmail());
  }

  enable2FA(password: string, hint?: string) {
    return this.twoFaMutation.run(() =>
      this._api.enable2Fa({ password, hint }),
    );
  }

  disable2FA(password: string) {
    return this.twoFaMutation.run(() => this._api.disable2Fa({ password }));
  }
}
