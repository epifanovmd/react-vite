import { createInjectDecorator } from "@shared/lib/di";

/**
 * Узкий контракт (Dependency Inversion) — именно то, что нужно HttpClient
 * от источника токена, и ничего больше. Реализуется через тонкий адаптер
 * `auth/services/AuthApiTokenSource.service.ts`, который оборачивает
 * `IAuthSessionService`, не давая `api/` знать о домене auth напрямую.
 * См. аналогичный паттерн `lib/socket/contract/TokenProvider.types.ts`.
 */
export interface ITokenSource {
  readonly accessToken: string;

  ensureFreshToken(): Promise<void>;
  refreshToken(): Promise<void>;
}

export const ITokenSource = createInjectDecorator<ITokenSource>();
