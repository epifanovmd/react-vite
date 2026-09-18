import {
  IBiometricDeviceDto,
  IDeleteBiometricResponseDto,
  IGenerateNonceResponseDto,
  IRegisterBiometricResponseDto,
  IVerifyBiometricSignatureResponseDto,
} from "@shared/api/gen/main/model";
import { createInjectDecorator } from "@shared/lib/di";
import { CollectionHolder } from "@shared/lib/holders";
import { ApiError, ApiResponse } from "@shared/lib/http";

export const IBiometricStore = createInjectDecorator<IBiometricStore>();

export interface IBiometricStore {
  readonly devicesHolder: CollectionHolder<IBiometricDeviceDto>;
  loadDevices(): Promise<void>;
  registerBiometric(data: {
    deviceId: string;
    deviceName: string;
    publicKey: string;
  }): Promise<ApiResponse<IRegisterBiometricResponseDto, ApiError>>;
  generateNonce(
    deviceId: string,
  ): Promise<ApiResponse<IGenerateNonceResponseDto, ApiError>>;
  verifySignature(data: {
    deviceId: string;
    signature: string;
  }): Promise<ApiResponse<IVerifyBiometricSignatureResponseDto, ApiError>>;
  deleteDevice(
    deviceId: string,
  ): Promise<ApiResponse<IDeleteBiometricResponseDto, ApiError>>;
}
