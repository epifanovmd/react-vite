---
id: domain/screens
title: Экраны и маршруты
summary: Маршрут → page → используемые слайсы, периметры _app/_auth, навигация шапки, gotcha экранов.
layer: project
roles: [developer, architect]
stages: [analysis, planning]
depends_on: [domain/overview]
---

# Экраны и маршруты

Маршруты — файлы `src/app/routes/` ([app](../../src/app/README.md)). Периметр
определяется pathless-layout: `_app` — только авторизованным (`AppLayout`), `_auth` —
только неавторизованным (`AuthLayout`).

| Маршрут                               | Page                            | Слайсы                                                                                                           |
| ------------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `/`                                   | —                               | редирект на `/profile`                                                                                           |
| `/sign-in`, `/sign-up`                | sign-in, sign-up                | features/sign-in (пароль, 2FA, passkey), features/sign-up                                                        |
| `/forgot-password`, `/reset-password` | forgot-password, reset-password | одноимённые features; `reset-password` требует `token` в query                                                   |
| `/profile`                            | profile                         | change-avatar, edit-profile, edit-privacy, request-email-verification                                            |
| `/security`                           | security                        | change-password, manage-two-factor, change-email, set-username, manage-passkeys, manage-sessions, delete-account |
| `/activity`                           | activity                        | entities/audit (свои события)                                                                                    |
| `/files`                              | files                           | features/upload-file, delete-file                                                                                |
| `/admin/users`                        | admin-users                     | features/edit-user-privileges, delete-user; комната `users`                                                      |
| `/admin/roles`                        | admin-roles                     | features/manage-roles, entities/permission (матрица); комната `roles`                                            |
| `/admin/api-keys`                     | admin-api-keys                  | features/create-api-key, revoke-api-key; комната `api-keys`                                                      |
| `/admin/audit`                        | admin-audit                     | entities/audit (все события); комната `audit`                                                                    |
| `/ui`, `/ui/$section`                 | ui-kit-demo                     | публичный UI Kit                                                                                                 |
| ошибки                                | errors                          | `ErrorPage`, `NotFoundPage`                                                                                      |

## Навигация

Пункты — `widgets/app-layout/model/constants.ts`. Группа без label — пункты в ряд;
с label и несколькими пунктами — выпадающее меню; `mobileOnly` — только в мобильном
меню (разделы аккаунта в шапке живут в меню профиля). `NavItem.permission` — право
или список (любое из), фильтр — в VM шапки.

## Gotcha экранов

- Аудит отдаёт курсор `{ items, nextCursor }` — курсорный холдер, не offset.
- Пагинированные ответы `{ items, total }`: для `usePaged` мапить в
  `{ data, totalCount }`; для `CollectionHolder.fromApi` — extractor
  (`page => page.items`).
- `Table` по умолчанию `flex-1` — на обычных страницах `className="flex-none"`;
  пустое состояние — `labels={{ empty }}`; тулбар — над таблицей.
- 2FA-статуса в `UserDto` нет — экран безопасности даёт оба действия.
- Переподключение сокета без комнаты (файлы): перечитать список только если сокет
  уже был на связи.
