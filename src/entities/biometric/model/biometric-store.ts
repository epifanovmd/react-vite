import { IApiService } from "@shared/api";
import { IBiometricDeviceDto } from "@shared/api/gen/model";
import { CollectionHolder } from "@shared/lib/holders";
import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

import { IBiometricStore } from "./biometric-types";

@injectable()
export class BiometricStore implements IBiometricStore {
  public devicesHolder = new CollectionHolder<IBiometricDeviceDto>({
    onFetch: async () => {
      const response = await this._api.getDevices();

      return { data: response.data?.devices, error: response.error };
    },
  });

  constructor(@IApiService() private _api: IApiService) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async loadDevices() {
    await this.devicesHolder.load();
  }

  async registerBiometric(data: {
    deviceId: string;
    deviceName: string;
    publicKey: string;
  }) {
    const response = await this._api.registerBiometric(data);

    if (response.data) {
      await this.loadDevices();
    }

    return response;
  }

  async generateNonce(deviceId: string) {
    return this._api.generateNonce({ deviceId });
  }

  async verifySignature(data: { deviceId: string; signature: string }) {
    return this._api.verifySignature(data);
  }

  async deleteDevice(deviceId: string) {
    const response = await this._api.deleteDevice(deviceId);

    if (!response.error) {
      this.devicesHolder.removeItem(device => device.deviceId === deviceId);
    }

    return response;
  }
}
