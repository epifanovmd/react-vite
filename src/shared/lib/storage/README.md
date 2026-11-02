---
module: shared/lib/storage
summary: DI-обёртка над localStorage, которая никогда не бросает исключений.
---

# storage

Ключ-значение хранилище для токенов, темы и пользовательских настроек. Скрывает
`localStorage` за контрактом, чтобы его можно было подменить в тестах и на других платформах.

## Public API

| Экспорт           | Что                                                                         |
| ----------------- | --------------------------------------------------------------------------- |
| `IStorageService` | DI-токен и контракт: `getItem`, `setItem`, `removeItem` (строки)            |
| `StorageService`  | реализация поверх `localStorage`                                            |
| `storageModule`   | `ContainerModule`: биндинг `IStorageService` → `StorageService` (singleton) |

## Устройство

Каждая операция обёрнута в `safely(op, fallback)`: при исключении чтение возвращает
`null`, запись и удаление — no-op. Поведение закреплено в `__tests__/storage.service.test.ts`.

## Зависимости

- `@shared/lib/di`.
- Регистрация — `src/app/app.module.ts`.
- Потребители: `shared/api/api.module.ts` и `shared/api/main/main-session.ts` (хранилище
  токенов через `PersistentTokenStorage` из `shared/lib/session`), `shared/lib/theme`
  (`ThemeStore`), `features/sign-in` и `features/manage-passkeys` (последний логин passkey).

## Gotcha

- Ошибки глотаются молча: при приватном режиме Safari, запрете доступа или
  `QuotaExceededError` запись «успешна», но значение не сохранится.
