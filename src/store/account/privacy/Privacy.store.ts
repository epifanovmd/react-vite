import { IApiService } from "@api";
import {
  PrivacySettingsDto,
  UpdatePrivacySettingsPayload,
} from "@api/api-gen/data-contracts";
import { EntityHolder, MutationHolder } from "@store";
import { makeAutoObservable } from "mobx";

import { IPrivacyStore } from "./Privacy.types";

@IPrivacyStore({ inSingleton: true })
export class PrivacyStore implements IPrivacyStore {
  public privacyHolder = new EntityHolder<PrivacySettingsDto>({
    onFetch: () => this._api.getPrivacySettings(),
  });
  public deleteMutation = new MutationHolder<void, boolean>();

  constructor(@IApiService() private _api: IApiService) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get settings() {
    return this.privacyHolder.data;
  }

  get isLoading() {
    return this.privacyHolder.isLoading;
  }

  async load() {
    await this.privacyHolder.load();
  }

  async update(payload: UpdatePrivacySettingsPayload) {
    const res = await this._api.updatePrivacySettings(payload);

    if (res.data) {
      this.privacyHolder.setData(res.data);

      return true;
    }

    return false;
  }

  async deleteAccount() {
    const res = await this.deleteMutation.run(() => this._api.deleteMyUser());

    return !res.error && !!res.data;
  }
}
