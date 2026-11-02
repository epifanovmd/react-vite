---
module: shared/lib/network
summary: DI-абстракция состояния сетевого подключения (online/offline) с веб-реализацией.
---

# network

Платформенный адаптер «есть сеть / нет сети» поверх `navigator.onLine` и событий
`window` `online`/`offline`.

## Public API

| Экспорт                 | Что                                                                            |
| ----------------------- | ------------------------------------------------------------------------------ |
| `INetworkStatusService` | DI-токен и контракт: `isOnline`, `onOnline(cb)`, `onOffline(cb)` → unsubscribe |
| `NetworkStatusService`  | веб-реализация                                                                 |
| `networkModule`         | `ContainerModule`: биндинг токена → `NetworkStatusService` (singleton)         |

## Устройство

Интерфейс и токен — `network.types.ts`; комментарий фиксирует замену для React Native
(`NetInfo`). Колбэки подписок аргументов не получают.

## Зависимости

- `@shared/lib/di`.
- Регистрация — `src/app/app.module.ts`.
- Потребитель — `shared/lib/socket/transport/socket.transport.ts`: `onOnline` будит
  переподключение.
