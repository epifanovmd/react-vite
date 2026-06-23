import { IBiometricDeviceDto } from "@api/api-gen/data-contracts";
import { createServiceDecorator } from "@di";
import { DeviceModel } from "@models";
import { CollectionHolder } from "@store";

export const IDevicesStore = createServiceDecorator<IDevicesStore>();

export interface IDevicesStore {
  devicesHolder: CollectionHolder<IBiometricDeviceDto>;
  models: DeviceModel[];
  isLoading: boolean;

  load(): Promise<void>;
  remove(deviceId: string): Promise<boolean>;
}
