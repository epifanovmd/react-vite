import {
  IProfileUpdateRequestDto,
  ISignInRequestDto,
  ITokensDto,
  TSignUpRequestDto,
  UserDto,
} from "@api/api-gen/data-contracts";
import { createServiceDecorator } from "@di";
import { ProfileModel } from "@models";
import { IEntityHolderResult, IHolderError } from "@store";

export enum AuthStatus {
  Idle = "idle",
  Loading = "loading",
  Authenticated = "authenticated",
  Unauthenticated = "unauthenticated",
}

export const IAuthStore = createServiceDecorator<IAuthStore>();

export interface IAuthStore {
  readonly status: AuthStatus;
  readonly user: UserDto | null;
  readonly profile: ProfileModel | null;
  readonly error: string | undefined;
  readonly isIdle: boolean;
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
  readonly isReady: boolean;
  readonly twoFactorToken: string | null;
  readonly twoFactorHint?: string;
  readonly isTwoFactorRequired: boolean;

  load(): Promise<IEntityHolderResult<UserDto, IHolderError>>;
  signIn(params: ISignInRequestDto): Promise<void>;
  verify2FA(password: string): Promise<void>;
  signUp(params: TSignUpRequestDto): Promise<void>;
  updateProfile(data: IProfileUpdateRequestDto): Promise<void>;
  restore(tokens?: ITokensDto): Promise<void>;
  signOut(): void;
}
