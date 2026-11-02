---
module: pages/security
summary: «Безопасность» — пароль, email, username, 2FA, passkeys, сессии, удаление аккаунта.
---

# security

Страница настроек безопасности аккаунта. Маршрут `/security`.

## Public API

| Экспорт        | Что                             |
| -------------- | ------------------------------- |
| `SecurityPage` | Компонент страницы безопасности |

## Устройство

- Маршрут — `src/app/routes/_app/security.lazy.tsx`.
- Без VM и состояния: страница только раскладывает карточки фич в две колонки
  (`lg`), ниже — сессии и удаление аккаунта.

## Зависимости

- `@features/change-password`, `@features/change-email`, `@features/set-username`,
  `@features/manage-two-factor`, `@features/manage-passkeys`,
  `@features/manage-sessions`, `@features/delete-account`.
- `@shared/ui` — `Card`, `PageHeader`, `PageLayout`.
