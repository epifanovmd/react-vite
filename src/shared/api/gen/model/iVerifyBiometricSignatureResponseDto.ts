import type { IVerifyBiometricSignatureResponseDtoTokens } from "./iVerifyBiometricSignatureResponseDtoTokens.ts";

export interface IVerifyBiometricSignatureResponseDto {
  verified: boolean;
  tokens: IVerifyBiometricSignatureResponseDtoTokens;
}
