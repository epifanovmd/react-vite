import { createServiceDecorator } from "@di";

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export const IAuthTokenStorage = createServiceDecorator<IAuthTokenStorage>();

export interface IAuthTokenStorage {
  readonly accessToken: string;
  readonly refreshToken: string;

  isTokenExpiringSoon(bufferSeconds?: number): boolean;
  setTokens(accessToken: string, refreshToken: string): void;
  restoreRefreshToken(): string | null;
  clear(): void;
}

export const IAuthSessionService =
  createServiceDecorator<IAuthSessionService>();

export interface IAuthSessionService {
  readonly accessToken: string;

  setTokens(accessToken: string, refreshToken: string): void;
  clearTokens(): void;
  restoreSession(): Promise<boolean>;
  ensureFreshToken(): Promise<void>;
  refreshToken(): Promise<void>;
}
