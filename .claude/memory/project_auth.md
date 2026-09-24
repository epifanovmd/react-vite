---
name: Auth architecture
description: Token lifecycle, session management, JWT, socket auth, 2FA, passkey/biometric — entities/auth + entities/user
type: project
---

## Слои и файлы (src/entities/auth/)

```
model/
  store.ts             AuthStore — status/2FA/error, signIn/signUp/verify2FA/restore/signOut
  types.ts             AuthStatus enum, IAuthStore
  validation.ts        loginValidation, passwordValidation (общие для sign-in/sign-up)
api/
  session-guard.ts     AuthSessionGuard — isCurrentSession(sessionId), signOut() (для entities/user)
auth.module.ts         DI-биндинги домена: guard и стор
index.ts               Public API: authModule, AuthStatus, IAuthStore, loginValidation, passwordValidation
```

В слайсе остался **только домен**. Механика токенов — общий `shared/lib/session`
(см. `project_session.md`), привязка к бэкенду — `shared/api/main/main-session.ts`
(см. `project_api.md`). Biometric и Passkey вынесены в свои места (см. ниже).

## Token lifecycle

```
TokenSession (shared/lib/session)
  ← конфиг бэкенда: CrossTabTokenStorage(app:refresh_token, канал app:tokens) + lock app:token-refresh
  → bearerAuth (HTTP middleware)        → запросы основного бэкенда
  → SocketTransport (via ITokenProvider) → socket auth
```

- `refreshToken` персистится в `IStorageService` под ключом `app:refresh_token`;
  `accessToken` живёт только в памяти и восстанавливается обновлением.
- Проактивное обновление — по `expiresIn` из ответа бэкенда (таймер + проверка
  перед запросом), JWT не разбирается; см. `project_session.md`.
- Конкурентные обновления делят один `refresh`; неудачное обновление чистит
  сессию и поднимает `onSessionExpired`, на который подписан `AuthStore.signOut()`.
- `restoreSession()` читает refresh-токен из хранилища и форсирует обновление;
  используется на старте (`__root.tsx` → `beforeLoad` → `auth.restore()`).

## HTTP (shared/lib/http)

Вместо axios-interceptors — пайплайн middleware: `notifyErrors` → `queryRace` →
`bearerAuth`. Подстановка токена, упреждающее обновление и один повтор по 401
живут в `bearerAuth`; сетевые ошибки и 5xx показывает `notifyErrors`, 401 — нет.
Все API-вызовы возвращают `{ data } | { error }`, наружу летит только `ApiError`.

## Socket auth

`ITokenProvider` (контракт — `shared/lib/socket/contract/token-provider.types.ts`)
связан в `api.module.ts` с сессией основного бэкенда через `toService`: отдельного
адаптера нет, `TokenSession` покрывает контракт по структуре — `accessToken`,
`refreshToken()`, `restoreSession()`, `onTokenChange(cb)` (подписка срабатывает
сразу с текущим токеном). `SocketTransport` использует это для аутентификации при connect/reconnect; exponential backoff (1s→2s→4s→8s→10s max) на `"io server disconnect"`/auth_error.

## 2FA

`AuthStore.signIn()` — если ответ `I2FARequiredDto` (`require2FA === true`), сохраняет `twoFactorToken`/`twoFactorHint`, статус остаётся `Unauthenticated`, `isTwoFactorRequired` становится `true`. `verify2FA(password)` шлёт `{ twoFactorToken, password }`, при успехе — `_session.setTokens(...)` и `Authenticated`. UI — `features/sign-in/ui/TwoFactorPrompt.tsx`.

## Passkey (WebAuthn) и Biometric — разные механизмы, оба ВНЕ entities/auth

- **Passkey**: отдельного стора нет (бывший `PasskeyStore` удалён). Вся логика — в `features/sign-in/model/usePasskeyAuth.ts`: напрямую через `IMainApi` (`@simplewebauthn/browser`: browser support check, `startRegistration`/`startAuthentication`), профиль-ID в storage под ключом `app:profileId`. При успешной аутентификации — `authStore.restore(tokens)` + `onSuccess` callback.
- **Biometric** (`entities/biometric` — отдельный слайс): `IBiometricStore` (`model/biometric-store.ts`), `devicesHolder` (`CollectionHolder<IBiometricDeviceDto>`) со списком зарегистрированных устройств, register/verify/delete device. Public API: `biometricModule`, `IBiometricStore`.

## Session management (multi-device) — entities/user

`ISessionStore` (`entities/user/model/session-store.ts`, типы — `session-types.ts`, модель — `session-model.ts`) — отдельный стор от `AuthStore`, список **чужих активных сессий** пользователя (не текущий токен):

- `sessionsHolder: CollectionHolder<SessionDto>` — список сессий/устройств
- `terminateMutation: MutationHolder<string>` — terminate одной сессии по id
- `terminateOtherSessions()` — logout всех сессий кроме текущей
- `handleNewSession`/`handleSessionTerminated` — реалтайм-обновления (см. `entities/user/model/realtime.ts`, socket events)
- Если завершена **текущая** сессия (`IAuthSessionGuard.isCurrentSession(sessionId)`, сверяется по `session.sessionId` из ответа бэкенда) → форсированный `signOut()` через `AuthSessionGuard`

`AuthSessionGuard` — контракт `IAuthSessionGuard` (`shared/lib/contracts`), implements `entities/auth/api/session-guard.ts`, инжектится в `entities/user` без прямого импорта `entities/auth` (Dependency Inversion, т.к. `entities/user` и `entities/auth` — соседние слайсы одного слоя).

## Auth vs User split

- `IAuthStore` (`entities/auth`) — только аутентификация/сессия: `status` (`AuthStatus`: Idle/Loading/Authenticated/Unauthenticated), 2FA state, `signIn/signUp/verify2FA/restore/signOut`.
- `IUserStore` (`entities/user`) — доменные данные текущего пользователя: профиль (`ProfileModel`), роли (`RoleModel`), effective permissions (`can(permission)`, `hasRole(role)`, wildcard-иерархия через `computeEffectivePermissions`), privacy settings. Использует `EntityHolder<UserDto>` внутри.
- Разделение осознанное: `AuthStore` не знает о профиле/ролях, `UserStore` не знает о токенах/2FA.
