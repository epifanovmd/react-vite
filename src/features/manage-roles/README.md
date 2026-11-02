---
module: features/manage-roles
summary: Создание ролей, сохранение их прав и удаление — действия админки ролей.
---

# manage-roles

Набор хуков-действий над ролями для админки. UI у слайса нет — список ролей и формы рисует страница.

## Public API

| Экспорт                  | Что                                                                               |
| ------------------------ | --------------------------------------------------------------------------------- |
| `useCreateRoleVM`        | `({ onCreated }) => { form, create }` — форма новой роли                          |
| `useSaveRolePermissions` | `({ onSaved }) => (role, permissions) => Promise<boolean>` — сохранить набор прав |
| `useDeleteRole`          | `({ onDeleted }) => (role) => Promise<boolean>` — удалить с подтверждением        |
| `newRoleSchema`          | zod-схема имени роли                                                              |
| `TNewRoleForm`           | тип формы новой роли                                                              |

## Устройство

- `useCreateRoleVM` → `IMainApi.createRole({ name })`; при успехе `onCreated`, сброс формы, тост.
- `useSaveRolePermissions` → `IMainApi.setRolePermissions(role.id, { permissions })`; `onSaved` получает роль из ответа сервера.
- `useDeleteRole` → `useConfirm` → `IMainApi.deleteRole(role.id)` → `onDeleted(role)`.
- Ошибки везде — `notifyApiError`; функции-действия возвращают `false` при отказе или ошибке.
- `model/validation.ts` — имя: trim, до 100 символов, строчная латиница/цифры/`-`/`_`, начинается с буквы.

## Зависимости

- `@shared/api` (`IMainApi`, `IRoleDto`), `@shared/lib/http`, `@shared/lib/notifications`, `@shared/ui` (`useZodForm`, `useConfirm`).
- Используется: `pages/admin-roles` (`useAdminRolesVM`, который реэкспортирует `newRoleSchema` и `TNewRoleForm`).

## Gotcha

- Сервер отдаёт созданную роль без поля `permissions` — `useCreateRoleVM` подставляет `[]`, так что в `onCreated` набор прав есть всегда.
