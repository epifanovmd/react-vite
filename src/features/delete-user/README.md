---
module: features/delete-user
summary: Удаление пользователя администратором с диалогом подтверждения.
---

# delete-user

Хук-действие удаления пользователя из админки: подтверждение, запрос, уведомление вызывающего. UI у слайса нет.

## Public API

| Экспорт         | Что                                                                                     |
| --------------- | --------------------------------------------------------------------------------------- |
| `useDeleteUser` | `({ onDeleted }) => (user: UserDto) => Promise<boolean>` — удалить, вернуть «удалён ли» |

## Устройство

- `model/useDeleteUser.ts`: `useConfirm` (описание — `email ?? username ?? id`, destructive) → `IMainApi.deleteUser(user.id)` → `await onDeleted(user)`.
- Отказ в подтверждении или ошибка сервера → `false`; ошибка показывается через `notifyApiError`.
- `onDeleted` может вернуть промис — хук его дожидается.

## Зависимости

- `@shared/api` (`IMainApi`, `UserDto`), `@shared/lib/http`, `@shared/lib/notifications`, `@shared/ui` (`useConfirm`).
- Используется: `pages/admin-users` (`useAdminUsersVM`).
