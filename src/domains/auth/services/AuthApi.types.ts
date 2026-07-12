import type {
  I2FARequiredDto,
  ISignInRequestDto,
  ITokensDto,
  TSignUpRequestDto,
} from "@api/gen/model";
import { createServiceDecorator } from "@di";

export type AuthResult =
  | { success: true }
  | I2FARequiredDto
  | { error: string };

export interface IAuthApiService {
  signIn(params: ISignInRequestDto): Promise<AuthResult>;
  signUp(params: TSignUpRequestDto): Promise<AuthResult>;
  verify2FA(password: string): Promise<AuthResult>;
  restore(tokens?: ITokensDto): Promise<boolean>;
  reset(): void;
}

export const IAuthApiService = createServiceDecorator<IAuthApiService>();
