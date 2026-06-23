import { IBiometricDeviceDto } from "@api/api-gen/data-contracts";
import { computed, makeObservable } from "mobx";

import { DataModelBase } from "../DataModelBase";
import { DateModel } from "../date";

export class DeviceModel extends DataModelBase<IBiometricDeviceDto> {
  public readonly lastUsedDate = new DateModel(() => this.data.lastUsedAt);
  public readonly createdAtDate = new DateModel(() => this.data.createdAt);

  constructor(data: IBiometricDeviceDto) {
    super(data);
    makeObservable(this, {
      id: computed,
      deviceId: computed,
      name: computed,
      lastUsed: computed,
      createdAt: computed,
    });
  }

  get id() {
    return this.data.id;
  }

  get deviceId() {
    return this.data.deviceId;
  }

  get name() {
    return this.data.deviceName ?? this.data.deviceId;
  }

  get lastUsed() {
    return this.lastUsedDate.data ? this.lastUsedDate.formattedDiff : "—";
  }

  get createdAt() {
    return this.createdAtDate.formattedDate;
  }
}
