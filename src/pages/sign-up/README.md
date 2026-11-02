---
module: pages/sign-up
summary: Страница регистрации.
---

# sign-up

Страница регистрации аккаунта. Маршрут `/sign-up`.

## Public API

| Экспорт      | Что                                      |
| ------------ | ---------------------------------------- |
| `SignUpPage` | Страница; пропсы `onSuccess`, `onSignIn` |

## Устройство

- Маршрут — `src/app/routes/_auth/sign-up.lazy.tsx` (периметр `_auth`, лейаут
  `AuthLayout`): успех → `/`, «Войти» → `/sign-in`.
- Тонкая обёртка: пропсы целиком передаются в `SignUpForm`.

## Зависимости

- `@features/sign-up`.
