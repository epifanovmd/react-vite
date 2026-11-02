---
module: entities/auth
summary: Аутентификация — статус входа, вход/регистрация/2FA/восстановление/выход, guard текущей сессии, общие валидации логина и пароля.
---

# auth

Только домен аутентификации. Механика токенов — [shared/lib/session](../../shared/lib/session/README.md),
привязка к бэкенду — `shared/api/main/main-session.ts`. Профиль и права — в
[entities/user](../user/README.md).

## Public API

| Экспорт                                 | Что                                                                    |
| --------------------------------------- | ---------------------------------------------------------------------- |
| `IAuthStore`, `AuthStatus`              | стор аутентификации; статус Idle/Loading/Authenticated/Unauthenticated |
| `loginValidation`, `passwordValidation` | общие zod-правила для форм входа и регистрации                         |
| `PASSKEY_LOGIN_STORAGE_KEY`             | ключ логина для passkey-входа в storage                                |
| `authModule`                            | DI-регистрация                                                         |

## Устройство

```
model/store.ts        AuthStore: status, 2FA, error; signIn/signUp/verify2FA/restore/signOut/logout
model/types.ts        AuthStatus, IAuthStore
model/validation.ts   loginValidation, passwordValidation
model/passkey.ts      PASSKEY_LOGIN_STORAGE_KEY
api/session-guard.ts  AuthSessionGuard — реализация IAuthSessionGuard (shared/lib/contracts)
auth.module.ts        guard и стор
```

- `logout()` — кнопка «Выйти»: `api.signOut({ notifyErrors: false })`, ошибка
  игнорируется, затем локальный `signOut()`. `signOut()` — только локально (истёкшая
  сессия, guard, удаление аккаунта).
- 2FA: ответ `require2FA === true` → сохраняются `twoFactorToken`/`twoFactorHint`,
  статус остаётся `Unauthenticated`, `isTwoFactorRequired = true`; `verify2FA(password)`
  → `setTokens` и `Authenticated`.
- `AuthStore` подписан на `session.onTokenChange`: непустой токен при
  `Unauthenticated` без 2FA → `Authenticated` (повтор после временной ошибки restore,
  вход в другой вкладке). `onSessionExpired` → `signOut()`.
- `restore()` читает refresh-токен из хранилища и форсирует обновление; на старте его
  вызывает `AppDataStore.initialize` до запуска роутера.
- `signUp` пишет ошибку в `verifyError` (геттер `error`), пустой ответ — «Неизвестная
  ошибка».
- `AuthSessionGuard` (`isCurrentSession(sessionId)`, `signOut()`) инжектится в
  `entities/user` через контракт — соседние слайсы не импортируют друг друга.

## Gotcha

- Passkey-логика не здесь: `features/sign-in/model/usePasskeyAuth.ts` напрямую через
  `IMainApi` и `@simplewebauthn/browser`; серверный biometric API веб не использует.
- `sessionId` для сверки текущей сессии — из ответа бэкенда, JWT не разбирается.
