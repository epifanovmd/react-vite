---
module: pages/forgot-password
summary: Страница запроса сброса пароля.
---

# forgot-password

Страница запроса письма для сброса пароля. Маршрут `/forgot-password`.

## Public API

| Экспорт              | Что                                        |
| -------------------- | ------------------------------------------ |
| `ForgotPasswordPage` | Страница; проп `onBack` — возврат ко входу |

## Устройство

- Маршрут — `src/app/routes/_auth/forgot-password.lazy.tsx` (периметр `_auth`,
  лейаут `AuthLayout`); `onBack` ведёт на `/sign-in`.
- Тонкая обёртка: пропсы целиком передаются в `ForgotPasswordForm`.

## Зависимости

- `@features/forgot-password`.
