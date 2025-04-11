import {
  IProfileDto,
  ISignInRequest,
  ITokensDto,
  TSignUpRequest,
} from "@api/api-gen/data-contracts.ts";
import { createServiceDecorator, DataHolder } from "@force-dev/utils";

export const IProfileDataStore = createServiceDecorator<IProfileDataStore>();

export interface IProfileDataStore {
  holder: DataHolder<IProfileDto>;
  profile?: IProfileDto;
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  isAdmin: boolean;

  getProfile(): Promise<IProfileDto | undefined>;

  updateToken(): Promise<ITokensDto>;

  signIn(params: ISignInRequest): Promise<void>;

  signUp(params: TSignUpRequest): Promise<void>;
}
