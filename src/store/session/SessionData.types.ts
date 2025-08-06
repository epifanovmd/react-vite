import {
  ISignInRequest,
  ITokensDto,
  TSignUpRequest,
} from "@api/api-gen/data-contracts";
import { createServiceDecorator, SupportInitialize } from "@force-dev/utils";

export const ISessionDataStore = createServiceDecorator<ISessionDataStore>();

export interface ISessionDataStore extends SupportInitialize {
  isLoading: boolean;
  isAuthorized: boolean;

  signIn(params: ISignInRequest): Promise<void>;
  signUp(params: TSignUpRequest): Promise<void>;
  restore(tokens?: ITokensDto): Promise<void>;
  clear(): void;
}
