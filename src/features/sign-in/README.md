---
module: features/sign-in
summary: Вход по логину и паролю, подтверждение второго фактора и вход по passkey.
---

# sign-in

Карточка входа: email/телефон и пароль, при включённой 2FA — второй пароль, альтернативно — вход по passkey, сохранённому на этом устройстве.

## Public API

| Экспорт      | Что                                                                   |
| ------------ | --------------------------------------------------------------------- |
| `SignInForm` | observer-карточка; пропсы `onSuccess`, `onForgotPassword`, `onSignUp` |

## Устройство

- `model/useSignInVM.ts` (`onSuccess`):
  - `handleLogin` → `IAuthStore.signIn(data)`; `onSuccess()` только если стор стал `isAuthenticated`;
  - `verifyTwoFactor` → `IAuthStore.verify2FA(twoFactorPassword)`, затем та же проверка. Второй пароль хранится в `useState`, не в форме.
- `model/usePasskeyAuth.ts` (`onSuccess`):
  - `profileId` — логин из `IStorageService` по `PASSKEY_LOGIN_STORAGE_KEY` (его пишет `features/manage-passkeys`);
  - `handleLogin`: `IMainApi.generateAuthenticationOptions({ login })` → `startAuthentication` → `IMainApi.verifyAuthentication` → `IAuthStore.restore(tokens)` → `onSuccess()`; ошибки — в локальном `error`.
- `ui/SignInForm.tsx`:
  - при `auth.isTwoFactorRequired` вместо кнопки «Войти» — `TwoFactorPrompt` (подсказка `auth.twoFactorHint`);
  - кнопка passkey (`PasskeyLogin`) — только если браузер поддерживает WebAuthn и на устройстве есть `profileId`;
  - `Alert` показывает `passkey.error ?? auth.error`.
- `model/validation.ts` — `loginValidation` и `passwordValidation` из `@entities/auth`.

## Зависимости

- `@entities/auth` (`IAuthStore`, `PASSKEY_LOGIN_STORAGE_KEY`, валидации).
- `@shared/api` (`IMainApi`), `@shared/lib/storage` (`IStorageService`), `@shared/ui`, `@simplewebauthn/browser`.
- Используется: `pages/sign-in`.

## Gotcha

- Ошибки входа и 2FA хранит стор (`IAuthStore.error`), а не VM: хук не возвращает результат, а читает `isAuthenticated` после вызова.
- Отмена системного диалога passkey (`NotAllowedError`) — не ошибка: `{ ok: false }` без текста (покрыто тестом).
- Нет сохранённого логина — ошибка «На этом устройстве нет passkey» без запроса к серверу.
