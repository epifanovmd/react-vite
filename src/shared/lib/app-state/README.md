---
module: shared/lib/app-state
summary: DI-абстракция активности приложения (вкладка видима/скрыта) с веб-реализацией на visibilitychange.
---

# app-state

Платформенный адаптер «приложение активно / свёрнуто». Нужен, чтобы инфраструктура
(сокет) реагировала на возврат во вкладку, не обращаясь к `document` напрямую.

## Public API

| Экспорт            | Что                                                                           |
| ------------------ | ----------------------------------------------------------------------------- |
| `IAppStateService` | DI-токен и контракт: `isActive`, `onChange(cb)` → unsubscribe                 |
| `AppStateService`  | веб-реализация: `document.visibilityState`, событие `visibilitychange`        |
| `appStateModule`   | `ContainerModule`: биндинг `IAppStateService` → `AppStateService` (singleton) |

## Устройство

- `app-state.types.ts` — токен (`createInjectDecorator`) и интерфейс; комментарий фиксирует
  замену для React Native (`AppState`).
- `onChange` передаёт в колбэк текущее значение `isActive` при каждом событии.

## Зависимости

- `@shared/lib/di` (`createInjectDecorator`).
- Регистрация — `src/app/app.module.ts`.
- Потребитель — `shared/lib/socket/transport/socket.transport.ts` (переподключение
  при возврате во вкладку).
