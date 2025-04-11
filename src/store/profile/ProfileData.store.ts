import { IApiService } from "@api";
import { IProfileDto } from "@api/api-gen/data-contracts.ts";
import { DataHolder } from "@force-dev/utils";
import { makeAutoObservable } from "mobx";

import { IProfileDataStore } from "./ProfileData.types";

@IProfileDataStore({ inSingleton: true })
class ProfileDataStore implements IProfileDataStore {
  public holder = new DataHolder<IProfileDto>();

  constructor(@IApiService() private _apiService: IApiService) {
    makeAutoObservable(this, {}, { autoBind: true });
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

  async getProfile() {
    this.holder.setLoading();

    const res = await this._apiService.getMyProfile();

    if (res.error) {
      this.holder.setError(res.error.message);
    } else if (res.data) {
      this.holder.setData(res.data);

      return res.data;
    }

    return undefined;
  }
}
