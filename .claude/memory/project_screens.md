---
name: Screens
description: Экраны поверх API шаблона — аккаунт, безопасность, журнал, файлы, задачи, админка; где что лежит и gotcha
type: project
---

## Маршруты → слайсы

| Маршрут           | Page           | Используемые слайсы                                                                                                                                        |
| ----------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/profile`        | profile        | features/change-avatar (слот `avatar` в ProfileCard), features/edit-privacy                                                                                |
| `/security`       | security       | change-password, manage-two-factor, change-email, set-username, manage-passkeys, manage-sessions, delete-account                                           |
| `/activity`       | activity       | entities/audit (`getMyAudit`); свои `audit:created` (адресно) → `feed.prepend`                                                                             |
| `/files`          | files          | features/upload-file (через API / напрямую: createUpload → PUT → completeUpload)                                                                           |
| `/jobs`           | jobs           | entities/job (стор + `job:updated` по сокету, всегда и владельцу), features/run-demo-job (карточка — по `jobs:demo`), `status()` воркеров через usePolling |
| `/admin/users`    | admin-users    | features/edit-user-privileges (`setPrivileges`, PermissionPicker); комната `users`                                                                         |
| `/admin/roles`    | admin-roles    | карточки ролей во всю ширину с PermissionPicker; системные роли (KnownRole) не удаляются в UI; комната `roles`                                             |
| `/admin/api-keys` | admin-api-keys | features/create-api-key (секрет показывается один раз); комната `api-keys`                                                                                 |
| `/admin/audit`    | admin-audit    | entities/audit (`listAuditEvents`), имена авторов из `getUserOptions` (только при `user:view`); комната `audit`                                            |

## Права

- Права — строки (`KnownPermission` в спецификации больше нет). Тип `Permission`, `ALL_PERMISSIONS` (`*`), `ADMIN_PERMISSIONS` (user:view/update/delete/privileges, role:view/create/update/delete, profile:view/update/delete, apikey:view/create/revoke, audit:view) — `entities/user/lib/permissions.ts`; `JOB_PERMISSIONS.DEMO` (`jobs:demo`, только демо-задача `demoEchoJob`) — `entities/job/lib/permissions.ts`. `*:manage` больше нет — каждая кнопка по своему праву.
- Подписи и группы прав — только каталог сервера `GET /api/v1/permissions` (`getPermissionCatalog`, `{ groups: [{ key, label, permissions: [{ name, label }] }] }`, первая группа `*` «Система»). `entities/permission`: `IPermissionCatalogStore` (singleton, грузится один раз, после ошибки — повторно; `labelOf(name)`), `PermissionPicker` (чекбоксы по группам; `readOnly`, `isLocked(name)`). В карточке роли `*` заблокирована, если текущий пользователь не суперпользователь (`isAdmin || can("*")`).
- `PermissionGate` (`@entities/user`, `permission` — право или список, любое): нет права (сразу или отозвано на открытой странице) → заглушка + `toast.warning` + `navigate({ to: "/", replace: true })`; ошибка `/me` → `Empty` с ошибкой вместо вечного лоадера. Пункты навигации — `NavItem.permission` (право или список, any-of), фильтр в `useHeaderVM`.
- VM страницы грузит данные и входит в комнату только с правом просмотра (`enabled: canView`, `useSocketRoom(type, canView ? "all" : null)`); флаги действий `canCreate/canUpdate/canDelete/canRevoke/canEditPrivileges` отдаёт VM.
- Модалки закрываются при отзыве права — `useCloseWhenForbidden(open, allowed, close)` из `@shared/lib/hooks` (сейчас — модалка прав пользователя в `useAdminUsersVM`).
- Модалка прав пользователя без `role:view` не грузит роли: показывает назначенные, чекбоксы ролей disabled.

## Живые списки (комнаты `room:subscribe {type, id: "all"}`)

| Комната    | Право       | События                                               | Реакция в VM                                                                        |
| ---------- | ----------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `users`    | user:view   | `user:updated` (UserDto), `user:deleted {id}`         | есть на странице — `updateItem`, иначе / удалён — `reload({ refresh: true })`       |
| `roles`    | role:view   | `role:updated` (IRoleDto), `role:deleted {id}`        | `upsertItem` / `removeItem`; rejoin — `refresh()`                                   |
| `api-keys` | apikey:view | `apikey:updated` (ApiKeyDto)                          | есть — `updateItem`, иначе `reload({ refresh: true })`                              |
| `audit`    | audit:view  | `audit:created` (AuditEventDto; автору — ещё и лично) | с учётом фильтров `feed.prepend` (дедуп по id — дубль из личного канала не страшен) |

## Реакция на смену прав и сессий

- `AUTH_PRIVILEGES_CHANGED` (401) — старый access после смены прав; `bearerAuth` на любой 401 обновляет токен и повторяет запрос, сессия остаётся. Сокет `user:privileges-changed {roles, permissions}` → `UserRealtime` делает `userStore.refresh()`.
- `session:terminated` с `sessionId: "all"` (аккаунт удалён) или текущей сессией → `signOut()` (`SessionStore.handleSessionTerminated`).
- Выход (`AppDataStore`, `isAuthenticated → false`): `userStore.reset()` (+ privacy), `sessionStore.reset()`, `jobStore.reset()` — следующий вход в той же вкладке не видит прежних прав.
- Ошибки сервера ROLE_SYSTEM_ROLE (409), ROLE_OWN_ROLE, USER_SUPERUSER_EDIT, PROFILE_SUPERUSER_EDIT — отдельной обработки нет, текст показывает `notifyApiError`.

## Навигация

- Группа без label — пункты в ряд; группа с label и >1 пунктом — выпадающее меню (`HeaderNavGroup`); `mobileOnly` — только в мобильном меню («Аккаунт», в шапке эти пункты в меню профиля через `ACCOUNT_NAV_ITEMS`).

## Gotcha

- Аудит отдаёт курсор `{items, nextCursor}` — `AuditFeed` (CursorHolder + свой `nextCursor`), не offset-холдеры.
- Пагинированные ответы `{items, total}` → для `usePaged` мапить в `{data, totalCount}`; для `CollectionHolder.fromApi` передавать extractor (`page => page.items`) — cast в fromApi скрывает ошибку от tsc.
- `Table` по умолчанию `flex-1` и растягивается на всю страницу — на обычных страницах `className="flex-none"`; пустое состояние — `labels={{ empty }}`, не строка в `empty`; тулбар лучше рендерить над таблицей (слот `toolbar` имеет свой `px-3`).
- Хуки холдеров без `watch` сами не грузят — `load()` в `useEffect`.
- 2FA-статуса в UserDto нет — экран даёт оба действия.
- Vite dev-сервер иногда не подхватывает новый routeTree.gen.ts — перезапуск.
