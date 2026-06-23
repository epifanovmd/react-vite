import { IApiService } from "@api";
import { IBiometricDeviceDto } from "@api/api-gen/data-contracts";
import { DeviceModel } from "@models";
import { CollectionHolder } from "@store";
import { makeAutoObservable } from "mobx";

import { IDevicesStore } from "./Devices.types";

@IDevicesStore({ inSingleton: true })
export class DevicesStore implements IDevicesStore {
  public devicesHolder = new CollectionHolder<IBiometricDeviceDto>({
    keyExtractor: d => d.deviceId,
  });

  constructor(@IApiService() private _api: IApiService) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get models() {
    return this.devicesHolder.items.map(d => new DeviceModel(d));
  }

  get isLoading() {
    return this.devicesHolder.isLoading;
  }

  async load() {
    await this.devicesHolder.fromApi(
      () => this._api.getDevices(),
      res => res.devices,
    );
  }

  async remove(deviceId: string) {
    const res = await this._api.deleteDevice({ deviceId });

    if (!res.error) {
      this.devicesHolder.removeItem(deviceId);

      return true;
    }

    return false;
  }
}
