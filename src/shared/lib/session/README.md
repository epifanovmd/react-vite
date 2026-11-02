---
module: shared/lib/session
summary: Механика токенов — TokenSession с проактивным обновлением, дедупликацией, Web Lock и синхронизацией вкладок; не знает HTTP и бэкенд.
---

# session

Переиспользуемый слой токенов. Не знает ни HTTP, ни конкретного бэкенда;
единственная зависимость — тип `IStorageService`.

## Public API

| Экспорт                          | Что                                                                             |
| -------------------------------- | ------------------------------------------------------------------------------- |
| `TokenSession`                   | ядро: состояние, дедупликация refresh, таймер, Web Lock, подписки               |
| `TokenGrant`, `TokenPair`        | ответ бэкенда; пара с `expiresAt`/`refreshAt`/`sessionId`; `toTokenPair`        |
| `ITokenSession`, `ITokenStorage` | контракты сессии и хранилища                                                    |
| `CrossTabTokenStorage`           | refresh на диск, полная пара — по `BroadcastChannel`; запасной путь — `storage` |
| `MemoryTokenStorage`             | только память                                                                   |
| `PersistentTokenStorage`         | поверх `IStorageService`, по умолчанию хранит только refresh                    |

## Устройство

`new TokenSession({ refresh, storage?, refreshBufferSeconds?, autoRefresh?, lockName? })`:

- `refresh` — обмен пары, возвращает `TokenGrant`. Реджект — сессия недействительна:
  очистка и `onSessionExpired`.
- `refreshBufferSeconds` (60, не больше половины срока), `autoRefresh` (true) — таймер
  тихого обновления.
- `lockName` — Web Lock: refresh-токен ротируется, без блокировки две вкладки
  обновили бы его одновременно.

Поведение: `ensureFreshToken` обновляет, если нет access или наступил `refreshAt`;
таймер на `refreshAt`; в скрытой вкладке не обновляет; на `visibilitychange`/`online`
— проверка сразу. Под блокировкой: другая вкладка уже прислала пару — выход без
запроса; иначе refresh-токен из общего хранилища.

Использование — `shared/api/main/main-session.ts`,
`shared/api/dummyjson/dummyjson-session.ts` ([shared/api](../../api/README.md)).

## Зависимости

`ITokenSession` **намеренно не наследует** `ITokenSource` из `lib/http`: слои
независимы, совпадение формы проверяется структурно при передаче в фабрику клиента и
типом в `token-session.test.ts`.

## Gotcha

- JWT не разбирается: срок — из `expiresIn` ответа по часам клиента. Без `expiresIn`
  (DummyJSON) заранее не обновляет — только по 401.
- Счётчик поколений: `clear()` и внешнее удаление токенов увеличивают его; ответ
  refresh, начатого раньше, отбрасывается.
- `ITokenStorage.subscribe` (необязательный): токены, записанные снаружи,
  подхватываются без обратной записи; исчезновение — конец сессии
  (`onSessionExpired`). `dispose()` снимает подписку.
- Без `BroadcastChannel` вкладки после ротации теряли бы access и обновлялись
  пинг-понгом. Проверка: две вкладки, одновременная перезагрузка — обе в сессии.
