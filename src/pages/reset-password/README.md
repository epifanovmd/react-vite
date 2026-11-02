---
module: pages/reset-password
summary: Страница установки нового пароля по токену из письма.
---

# reset-password

Страница сброса пароля по ссылке из письма. Маршрут `/reset-password?token=…`.

## Public API

| Экспорт             | Что                                    |
| ------------------- | -------------------------------------- |
| `ResetPasswordPage` | Страница; пропсы `token` и `onSuccess` |

## Устройство

- Маршрут из двух файлов: `src/app/routes/_auth/reset-password.tsx` (валидация
  search, `beforeLoad`) и `reset-password.lazy.tsx` (компонент; `onSuccess` ведёт на
  `/sign-in`). Периметр `_auth`.
- Тонкая обёртка над `ResetPasswordForm`.

## Зависимости

- `@features/reset-password`.

## Gotcha

- Без `token` в query `beforeLoad` редиректит на `/sign-in` — страница всегда
  получает непустой токен.
