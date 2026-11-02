---
module: pages/admin-audit
summary: Общий журнал аудита всех пользователей с фильтрами по типу и автору.
---

# admin-audit

Страница «Журнал аудита»: события безопасности всех пользователей. Маршрут `/admin/audit`.

## Public API

| Экспорт          | Что                               |
| ---------------- | --------------------------------- |
| `AdminAuditPage` | Компонент страницы общего журнала |

## Устройство

- Маршрут — `src/app/routes/_app/admin/audit.lazy.tsx`.
- `PermissionGate` по `audit:view`; при отказе — навигация на `/`.
- VM `useAdminAuditVM`: лента `useAuditFeed` поверх `api.listAuditEvents` с фильтрами
  `type` и `actorId` (локальный `useState`); смена фильтра перезагружает ленту (`deps`).
- Опции фильтра типа — `AUDIT_TYPE_OPTIONS` из `AUDIT_EVENT_TYPES` и подписей
  `auditEventMeta`.
- Список авторов — `useCollection` поверх `api.getUserOptions`, только при `user:view`;
  без этого права фильтр по автору пуст, а в колонке автора — укороченный id.
- Сокет: комната `audit` (с `canView`), при входе — `feed.load`; `audit:created`
  добавляется в начало ленты, если проходит текущие фильтры.

## Зависимости

- `@entities/audit` — `useAuditFeed`, `AuditEventTable`, `AUDIT_EVENT_TYPES`,
  `auditEventMeta`.
- `@entities/user` — `ADMIN_PERMISSIONS`, `IUserStore`, `PermissionGate`.
- `@shared/api`, `@shared/lib/holders`, `@shared/lib/socket`, `@shared/ui`.

## Gotcha

- Вход в комнату (в т.ч. повторный после переподключения) перезагружает ленту с
  первой страницы — подгруженные страницы сбрасываются.
- Фильтр типа содержит только известные клиенту типы; неизвестные события в ленте
  показываются с сырым типом.
