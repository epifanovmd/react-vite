import { createServiceDecorator } from "@di";

export interface ITokenProvider {
  readonly accessToken: string;

  refreshToken(): Promise<void>;
  restoreSession(): Promise<boolean>;
  onTokenChange(cb: (token: string) => void): () => void;
}

export const ITokenProvider = createServiceDecorator<ITokenProvider>();
