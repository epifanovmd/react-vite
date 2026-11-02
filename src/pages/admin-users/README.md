---
module: pages/admin-users
summary: Админка пользователей — поиск, пагинация, правка прав и удаление.
---

# admin-users

Страница «Пользователи»: учётные записи и их права. Маршрут `/admin/users`.

## Public API

| Экспорт          | Что                              |
| ---------------- | -------------------------------- |
| `AdminUsersPage` | Компонент страницы пользователей |

## Устройство

- Маршрут — `src/app/routes/_app/admin/users.lazy.tsx`.
- `PermissionGate` по `user:view`; при отказе — навигация на `/`.
- VM `useAdminUsersVM`: `usePaged` поверх `api.getUsers` (страница 20) с
  `watch: [query]` — строка поиска с debounce 300 мс (`@mantine/hooks`);
  `enabled: canView`.
- Флаги: `canEditPrivileges` (`user:privileges`) — модалка
  `EditUserPrivilegesModal`; `canDelete` (`user:delete`) — `useDeleteUser`. Для
  собственной строки действия не показываются.
- Сокет: комната `users` (с `canView`), при входе — `reload({ refresh: true })`;
  `user:updated` — `updateItem`, если пользователь на странице, иначе перезапрос;
  `user:deleted` — перезапрос, если удалённый на странице.

## Зависимости

- `@entities/user` — `ADMIN_PERMISSIONS`, `IUserStore`, `PermissionGate`, `UserAvatar`.
- `@features/edit-user-privileges`, `@features/delete-user`.
- `@shared/api`, `@shared/lib/holders`, `@shared/lib/socket`, `@shared/lib/hooks`
  (`useLatestRef`, `useCloseWhenForbidden`), `@shared/lib/utils`, `@shared/ui`.

## Gotcha

- Отзыв `user:privileges` на открытой странице закрывает модалку правки
  (`useCloseWhenForbidden`) — покрыто тестом.
- Без `user:view` нет ни запроса, ни подписки на комнату (тест).
- Колонки получают VM через `useLatestRef` и пересобираются только по флагам прав и
  id текущего пользователя.
