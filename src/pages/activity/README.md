---
module: pages/activity
summary: «Мой журнал» — лента событий безопасности текущего пользователя.
---

# activity

Страница «Мой журнал»: входы и изменения безопасности своего аккаунта. Маршрут `/activity`.

## Public API

| Экспорт        | Что                        |
| -------------- | -------------------------- |
| `ActivityPage` | Компонент страницы журнала |

## Устройство

- Маршрут — `src/app/routes/_app/activity.lazy.tsx` (периметр `_app`).
- VM `useActivityVM`: лента `useAuditFeed` поверх `api.getMyAudit` (курсор), без
  фильтров; таблица — `AuditEventTable` без колонки автора.
- Права не проверяются — свой журнал доступен любому авторизованному.
- Комнату сокета не открывает: `audit:created` слушается всегда и добавляется в
  ленту (`feed.prepend`) только при `event.actorId === user.id`.

## Зависимости

- `@entities/audit` — `useAuditFeed`, `AuditEventTable`.
- `@entities/user` — `IUserStore` (id текущего пользователя).
- `@shared/api`, `@shared/lib/socket`, `@shared/ui`.

## Gotcha

- Свои события приходят адресно, а у админа в комнате `audit` — ещё и из общего
  журнала; фильтр по `actorId` и дедуп по id в `AuditFeed.prepend` не дают показать
  чужое и задвоить своё.
