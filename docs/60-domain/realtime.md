---
id: domain/realtime
title: Живые обновления
summary: Комнаты Socket.IO экранов администрирования, их права, события и реакция VM; личные события пользователя.
layer: project
roles: [developer]
stages: [implementation]
depends_on: [domain/access]
---

# Живые обновления

Механика комнат и переподключения — [shared/lib/socket](../../src/shared/lib/socket/README.md).
Вход в комнату — `room:subscribe { type, id: "all" }` и только при праве на все.

| Комната    | Право       | События                                           | Реакция VM                                                                    |
| ---------- | ----------- | ------------------------------------------------- | ----------------------------------------------------------------------------- |
| `users`    | user:view   | `user:updated` (UserDto), `user:deleted { id }`   | есть на странице — `updateItem`, иначе / удалён — `reload({ refresh: true })` |
| `roles`    | role:view   | `role:updated` (IRoleDto), `role:deleted { id }`  | `upsertItem` / `removeItem`; при повторном входе — `refresh()`                |
| `api-keys` | apikey:view | `apikey:updated` (ApiKeyDto)                      | есть — `updateItem`, иначе `reload({ refresh: true })`                        |
| `audit`    | audit:view  | `audit:created` (AuditEventDto; автору — и лично) | с учётом фильтров `feed.prepend`, дедуп по id                                 |

## Личные события

Без комнаты, адресно текущему пользователю (`entities/user`):

- `audit:created` — свои события в «Моём журнале»;
- `user:privileges-changed` — перечитать пользователя;
- `session:*` — новые и завершённые сессии, завершение текущей — выход.

После переподключения экран перечитывает данные: события за время обрыва не
доставляются.
