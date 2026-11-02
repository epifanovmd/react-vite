---
module: pages/admin-api-keys
summary: Админка API-ключей — список с пагинацией, создание и отзыв.
---

# admin-api-keys

Страница управления API-ключами сервисов и интеграций. Маршрут `/admin/api-keys`.

## Public API

| Экспорт            | Что                           |
| ------------------ | ----------------------------- |
| `AdminApiKeysPage` | Компонент страницы API-ключей |

## Устройство

- Маршрут — `src/app/routes/_app/admin/api-keys.lazy.tsx`.
- Страница обёрнута в `PermissionGate` по `apikey:view`; при отказе — навигация на `/`.
- VM `useAdminApiKeysVM`: `usePaged` поверх `api.listApiKeys` (страница 20,
  `{ items, total }` → `{ data, totalCount }`), `enabled: canView`.
- Флаги: `canCreate` (`apikey:create`) — кнопка `CreateApiKeyButton`; `canRevoke`
  (`apikey:revoke`) — колонка действия «Отозвать» (`useRevokeApiKey`).
- Сокет: комната `api-keys` (только с `canView`), при входе — `reload({ refresh: true })`;
  `apikey:updated` — `updateItem`, если ключ на странице, иначе перезапрос.
- Состояние ключа (активен / истёк / отозван) вычисляется на клиенте по
  `revokedAt` и `expiresAt`.

## Зависимости

- `@entities/user` — `ADMIN_PERMISSIONS`, `IUserStore`, `PermissionGate`.
- `@features/create-api-key`, `@features/revoke-api-key`.
- `@shared/api`, `@shared/lib/holders`, `@shared/lib/socket`, `@shared/lib/hooks`
  (`useLatestRef`), `@shared/lib/utils` (`formatter`), `@shared/ui`.

## Gotcha

- Колонки получают VM через `useLatestRef` и пересобираются только по `canRevoke` —
  ячейки не перемонтируются на каждый рендер.
- Созданный ключ (здесь или где-то ещё) попадает на первую страницу:
  `onCreated` — `goToPage(1, { refresh: true })`.
