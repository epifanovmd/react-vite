---
module: pages/admin-roles
summary: Админка ролей — создание, матрица прав каждой роли, удаление.
---

# admin-roles

Страница «Роли»: наборы прав для пользователей. Маршрут `/admin/roles`.

## Public API

| Экспорт          | Что                      |
| ---------------- | ------------------------ |
| `AdminRolesPage` | Компонент страницы ролей |

## Устройство

- Маршрут — `src/app/routes/_app/admin/roles.lazy.tsx`.
- `PermissionGate` по `role:view`; при отказе — навигация на `/`.
- VM `useAdminRolesVM`: `useCollection` поверх `api.getRoles` (`enabled: canView`);
  создание, сохранение прав и удаление — хуки `@features/manage-roles`, результат
  применяется к коллекции (`upsertItem` / `updateItem` / `removeItem`).
- Флаги: `canCreate` / `canUpdate` / `canDelete` — `role:create/update/delete`;
  `isSuperUser` (`isAdmin` или право `*`) — разрешает выдавать `*`.
- Сокет: комната `roles` (с `canView`), при входе — `refresh()`; `role:updated` —
  `upsertItem`, `role:deleted` — `removeItem`.
- `RolePermissionsCard` — карточка роли с `PermissionMatrix`: права правятся локально,
  сохраняются кнопкой (активна только при отличии от сохранённого набора). Загрузка
  кнопки — `useMutation` вокруг `onSave` (компонент — `observer`): отклонённый `onSave`
  не оставляет кнопку в загрузке.

## Зависимости

- `@entities/user` — `ADMIN_PERMISSIONS`, `ALL_PERMISSIONS`, `IUserStore`,
  `PermissionGate`.
- `@entities/permission` — `PermissionMatrix`.
- `@features/manage-roles` — форма и мутации ролей.
- `@shared/api`, `@shared/lib/holders`, `@shared/lib/socket`, `@shared/lib/utils`
  (`pluralize`), `@shared/ui`.

## Gotcha

- Несохранённые правки карточки сбрасываются только при смене набора прав роли
  (сравнение отсортированного «отпечатка»), а не при новом объекте роли из сокета —
  покрыто тестом `RolePermissionsCard.test.tsx`.
- Системные роли (`KnownRole`) удалить нельзя — кнопки удаления у них нет.
- Право `*` в матрице заблокировано, если текущий пользователь не суперпользователь.
- Созданная роль без `permissions` в ответе попадает в список с пустым набором прав
  (тест `useAdminRolesVM.test.ts`).
