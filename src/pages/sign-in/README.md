---
module: pages/sign-in
summary: Страница входа.
---

# sign-in

Страница входа в аккаунт. Маршрут `/sign-in`.

## Public API

| Экспорт      | Что                                                          |
| ------------ | ------------------------------------------------------------ |
| `SignInPage` | Страница; пропсы `onSuccess`, `onForgotPassword`, `onSignUp` |

## Устройство

- Маршрут — `src/app/routes/_auth/sign-in.lazy.tsx` (периметр `_auth`, лейаут
  `AuthLayout`): успех → `/`, «Забыли пароль» → `/forgot-password`,
  «Регистрация» → `/sign-up`.
- Тонкая обёртка: пропсы целиком передаются в `SignInForm`.

## Зависимости

- `@features/sign-in`.
