import {
  ApiResponseDto,
  UserDto,
} from "@api/api-gen/data-contracts";
import { createServiceDecorator } from "@di";
import { IMutationHolderResult, MutationHolder } from "@store";

export const ISecurityStore = createServiceDecorator<ISecurityStore>();

export interface ISecurityStore {
  changePasswordMutation: MutationHolder<void, ApiResponseDto>;
  setUsernameMutation: MutationHolder<void, UserDto>;
  verifyEmailMutation: MutationHolder<void, boolean>;
  twoFaMutation: MutationHolder<void, ApiResponseDto>;

  changePassword(password: string): Promise<IMutationHolderResult<ApiResponseDto>>;
  setUsername(username: string): Promise<IMutationHolderResult<UserDto>>;
  requestVerifyEmail(): Promise<IMutationHolderResult<boolean>>;
  enable2FA(
    password: string,
    hint?: string,
  ): Promise<IMutationHolderResult<ApiResponseDto>>;
  disable2FA(password: string): Promise<IMutationHolderResult<ApiResponseDto>>;
}
