---
module: features/revoke-api-key
summary: Отзыв API-ключа с диалогом подтверждения.
---

# revoke-api-key

Хук-действие отзыва API-ключа: подтверждение, запрос, уведомление вызывающего. UI у слайса нет.

## Public API

| Экспорт           | Что                                                                                        |
| ----------------- | ------------------------------------------------------------------------------------------ |
| `useRevokeApiKey` | `({ onRevoked }) => (key: ApiKeyDto) => Promise<boolean>` — отозвать, вернуть «отозван ли» |

## Устройство

- `model/useRevokeApiKey.ts`: `useConfirm` («Отозвать ключ {name}?», destructive) → `IMainApi.revokeApiKey(key.id)` → `await onRevoked(key)`.
- Отказ в подтверждении или ошибка сервера → `false`; ошибка показывается через `notifyApiError`.
- `onRevoked` может вернуть промис — хук его дожидается.

## Зависимости

- `@shared/api` (`IMainApi`, `ApiKeyDto`), `@shared/lib/http`, `@shared/lib/notifications`, `@shared/ui` (`useConfirm`).
- Используется: `pages/admin-api-keys` (`useAdminApiKeysVM`).
