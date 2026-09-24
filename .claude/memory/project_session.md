---
name: Session Layer
description: Общий слой токенов lib/session — срок из ответа бэкенда, тихое обновление, вкладки (BroadcastChannel + Web Locks), связь с HTTP и сокетом
type: project
---

## Где что

`shared/lib/session/` — переиспользуемая механика токенов, ничего не знает ни об
HTTP, ни о конкретном бэкенде. Единственная зависимость — тип `IStorageService`.

| Файл                                  | Что                                                                                                                               |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `session.types.ts`                    | `TokenGrant` (ответ бэкенда), `TokenPair` (+`expiresAt`/`refreshAt`/`sessionId`), `ITokenStorage`, `ITokenSession`, `toTokenPair` |
| `token-session.ts`                    | `TokenSession` — ядро: состояние, дедупликация, таймер, Web Lock, подписки                                                        |
| `storage/cross-tab-token-storage.ts`  | синхронизация вкладок: полная пара по `BroadcastChannel`, запасной путь — событие `storage`                                       |
| `storage/memory-token-storage.ts`     | токены только в памяти                                                                                                            |
| `storage/persistent-token-storage.ts` | поверх `IStorageService`; по умолчанию хранит только refresh                                                                      |

## Как конфигурируется

`new TokenSession({ refresh, storage?, refreshBufferSeconds?, autoRefresh?, lockName? })`:

- `refresh` — как бэкенд меняет пару; возвращает `TokenGrant`
  (`accessToken`, `refreshToken`, `expiresIn?`, `sessionId?`). Реджект = сессия
  недействительна: очищается и поднимается `onSessionExpired`;
- `storage` — где пара живёт между запусками (по умолчанию память);
- `refreshBufferSeconds` (60) — за сколько до истечения обновлять, не больше
  половины срока; `autoRefresh` (true) — таймер тихого обновления;
- `lockName` — Web Lock для обновления: refresh-токен ротируется, без общей
  блокировки две вкладки обновили бы его одновременно и одна вылетела бы.

**JWT на фронте не разбирается.** Срок — из `expiresIn` ответа (как OAuth
`expires_in`), считается по часам клиента на получении (`expiresAt`, `refreshAt`
в `toTokenPair`). Без `expiresIn` (DummyJSON) заранее не обновляет — только 401.
`sessionId` — тоже из ответа (`session.sessionId`), его сверяет `AuthSessionGuard`.

Поведение: `ensureFreshToken` обновляет, если нет access или наступил
`refreshAt`; таймер на `refreshAt`; в скрытой вкладке таймер не обновляет
(токен пришлёт видимая), на `visibilitychange`/`online` — проверка сразу.
Под блокировкой: если другая вкладка уже прислала свежую пару — выход без
запроса; иначе refresh-токен берётся из общего хранилища (самый свежий).

## Направление зависимостей

`ITokenSource` — порт в `lib/http`, его владелец `bearerAuth`, это чистый тип
без DI. `ITokenSession` **намеренно не наследует** его: слой сессии не зависит
от транспорта. Совпадение формы проверяется структурно там, где сессию передают
в фабрику клиента, и типом в тесте `token-session.test.ts`.

Граф односторонний: `lib/http` и `lib/session` независимы и тянут только
type-only контракты соседей → `shared/api/*` соединяет их в `api.module.ts`.
Глобального DI-токена «источник токена» нет: каждый бэкенд передаёт свою сессию
в фабрику клиента явно.

## Использование

Сессия — инфраструктура бэкенда, поэтому лежит рядом с его API, а не в домене:

- `shared/api/main/main-session.ts` — `CrossTabTokenStorage(PersistentTokenStorage(app:refresh_token),
{ channel: "app:tokens" })`, `lockName: "app:token-refresh"`, буфер 60 с;
- `shared/api/dummyjson/dummyjson-session.ts` — `DummyJsonSession extends
TokenSession`: память, реактивная стратегия, сверху только `login`.

`entities/auth` — только домен: статус, 2FA, guard; он потребляет `IMainSession`.
Сокетный `ITokenProvider` связан с сессией основного бэкенда в `api.module.ts`
через `toService`. Покрыто `shared/api/__tests__/api-module-wiring.test.ts`.

Логин и refresh всегда ходят по отдельному HTTP-клиенту без `bearerAuth`,
иначе 401 от самого refresh ушёл бы в рекурсию.

## Тесты DI

Контейнер собирается прямо в тестах (vitest, jsdom): `api-module-wiring.test.ts`
грузит `apiModule` и подставляет заглушки `IStorageService` и
`INotificationService`. DI-модули импортируют контракты напрямую
(`notifications/notification.types`), а не бочки — бочка уведомлений тянет ещё
и UI-компоненты.

## Правки хранилища извне

`ITokenStorage.subscribe` — необязательный метод. Если он есть, `TokenSession`
подхватывает токены, записанные снаружи, и обратно в хранилище их не пишет.
Исчезновение токенов трактуется как конец сессии: поднимается
`onSessionExpired`, то есть доменный стор разлогинится. `dispose()` снимает
подписку.

В вебе используется `CrossTabTokenStorage({ keys, channel })`: на диск пишет
только refresh, а полную пару (access, срок, сессию) рассылает по
`BroadcastChannel` в памяти — иначе после ротации в одной вкладке остальные
теряли бы access и обновлялись сами, пинг-понгом. Без канала — событие
`storage`. Вход, обновление и выход доходят до всех вкладок; собственные
записи петлю не создают. Живая проверка: две вкладки, одновременная
перезагрузка — обе остаются в сессии.
