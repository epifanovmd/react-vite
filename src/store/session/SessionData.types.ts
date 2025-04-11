import { ITokensDto } from "@api/api-gen/data-contracts.ts";
import { createServiceDecorator, SupportInitialize } from "@force-dev/utils";

export const ISessionDataStore = createServiceDecorator<ISessionDataStore>();

export interface ISessionDataStore extends SupportInitialize<() => void> {
  isAuthorized: boolean;
  isReady: boolean;

  restore(tokens?: ITokensDto): Promise<string>;
}
