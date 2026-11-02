---
module: features/edit-user-privileges
summary: Назначение пользователю ролей и прямых прав администратором.
---

# edit-user-privileges

Модалка админки: роли (чекбоксы) и прямые права (матрица) выбранного пользователя, сохраняются одним запросом.

## Public API

| Экспорт                   | Что                                                                                              |
| ------------------------- | ------------------------------------------------------------------------------------------------ |
| `EditUserPrivilegesModal` | observer-модалка; `user` (`null` — закрыта), `onClose`, `onSaved(user)` (после него — `onClose`) |

## Устройство

- `model/useEditUserPrivilegesVM.ts` (`{ user, onSaved }`):
  - при смене `user` локальные `roles`/`permissions` заполняются из `user.roles` и `user.directPermissions`;
  - список всех ролей — `useCollection` над `IMainApi.getRoles()`, грузится один раз и только при праве `ADMIN_PERMISSIONS.ROLE_VIEW` (`IUserStore.can`);
  - без этого права `roleOptions` — роли самого пользователя, `canEditRoles = false`, чекбоксы заблокированы;
  - `save` — `useMutation` над `IMainApi.setPrivileges(user.id, { roles, permissions })`; успех — тост и `onSaved`, ошибка — `notifyApiError`.
- Права задаются набором целиком через `setPermissions` (`PermissionMatrix` из `@entities/permission`).

## Зависимости

- `@entities/user` (`IUserStore`, `ADMIN_PERMISSIONS`), `@entities/permission` (`PermissionMatrix`).
- `@shared/api` (`IMainApi`), `@shared/lib/holders` (`useCollection`, `useMutation`), `@shared/lib/http`, `@shared/lib/notifications`, `@shared/ui`.
- Используется: `pages/admin-users`.

## Gotcha

- Последнюю роль снять нельзя (`canToggleRole`): сервер отклоняет пустой список ролей.
- Без пользователя `save()` запрос не отправляет и успехом не считается (покрыто тестом).
- Права подхватываются и для пользователя, переданного после первого рендера (эффект зависит от `user`).
