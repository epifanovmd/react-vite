import type { EDevicePlatform } from "./eDevicePlatform.ts";

export interface IRegisterDeviceBody {
  token: string;
  platform: EDevicePlatform;
  deviceName?: string;
}
