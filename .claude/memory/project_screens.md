---
name: Screens
description: Экраны поверх API шаблона — аккаунт, безопасность, журнал, файлы, задачи, админка; где что лежит и gotcha
type: project
---

## Маршруты → слайсы

| Маршрут           | Page           | Используемые слайсы                                                                                              |
| ----------------- | -------------- | ---------------------------------------------------------------------------------------------------------------- |
| `/profile`        | profile        | features/change-avatar (слот `avatar` в ProfileCard), features/edit-privacy                                      |
| `/security`       | security       | change-password, manage-two-factor, change-email, set-username, manage-passkeys, manage-sessions, delete-account |
| `/activity`       | activity       | entities/audit (`getMyAudit`)                                                                                    |
| `/files`          | files          | features/upload-file (через API / напрямую: createUpload → PUT → completeUpload)                                 |
| `/jobs`           | jobs           | entities/job (стор + `job:updated` по сокету), features/run-demo-job, `status()` воркеров через usePolling       |
| `/admin/users`    | admin-users    | features/edit-user-privileges (`setPrivileges`)                                                                  |
| `/admin/roles`    | admin-roles    | матрица прав на странице; системные роли (KnownRole) не удаляются в UI                                           |
| `/admin/api-keys` | admin-api-keys | features/create-api-key (секрет показывается один раз)                                                           |
| `/admin/audit`    | admin-audit    | entities/audit (`listAuditEvents`), имена авторов из `getUserOptions`                                            |

## Права

- Админ-страницы обёрнуты в `PermissionGate` (`@entities/user`), пункты навигации — `NavItem.permission`, фильтр в `useHeaderVM`.
- Подписи прав — `PERMISSION_LABELS`/`KNOWN_PERMISSIONS` в `entities/user/lib/permissions.ts`.
- `demoEchoJob` на сервере требует `jobs:manage` (есть только у admin через `*`).

## Навигация

- Группа без label — пункты в ряд; группа с label и >1 пунктом — выпадающее меню (`HeaderNavGroup`); `mobileOnly` — только в мобильном меню («Аккаунт», в шапке эти пункты в меню профиля через `ACCOUNT_NAV_ITEMS`).

## Gotcha

- Аудит отдаёт курсор `{items, nextCursor}` — `AuditFeed` (CursorHolder + свой `nextCursor`), не offset-холдеры.
- Пагинированные ответы `{items, total}` → для `usePaged` мапить в `{data, totalCount}`; для `CollectionHolder.fromApi` передавать extractor (`page => page.items`) — cast в fromApi скрывает ошибку от tsc.
- `Table` по умолчанию `flex-1` и растягивается на всю страницу — на обычных страницах `className="flex-none"`; пустое состояние — `labels={{ empty }}`, не строка в `empty`; тулбар лучше рендерить над таблицей (слот `toolbar` имеет свой `px-3`).
- Хуки холдеров без `watch` сами не грузят — `load()` в `useEffect`.
- 2FA-статуса в UserDto нет — экран даёт оба действия.
- Vite dev-сервер иногда не подхватывает новый routeTree.gen.ts — перезапуск.
