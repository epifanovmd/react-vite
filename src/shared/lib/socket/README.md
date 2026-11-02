---
module: shared/lib/socket
summary: Socket.IO-транспорт с переподключением и авторизацией через контракт провайдера токена, комнаты со счётчиком подписок, React-хуки.
---

# socket

Транспорт реального времени. Токен получает через контракт `ITokenProvider`
(Dependency Inversion), реализацию связывает `shared/api/api.module.ts`.

## Public API

| Экспорт                                      | Что                                      |
| -------------------------------------------- | ---------------------------------------- |
| `useSocketStatus`                            | статус подключения                       |
| `useSocketEvent(event, handler, enabled?)`   | подписка на событие                      |
| `useSocketRoom(type, id \| null, onRejoin?)` | вход в комнату; `null` — не входить      |
| `subscribeSocketRoom`                        | то же вне React (`rooms.ts`)             |
| `ITokenProvider`                             | контракт — `@shared/lib/socket/contract` |
| события                                      | `events/socket.events.ts` — типы событий |
| `createFakeSocket`                           | `testing/` — фейк для тестов             |

## Устройство

- `transport/socket.transport.ts` — `reconnection: true`, бесконечные попытки;
  при `"io server disconnect"`/auth_error — своя экспоненциальная задержка
  1→2→4→8→10 с (`reconnect-scheduler.ts`). Токен — при connect/reconnect.
- `rooms.ts`: `room:subscribe { type, id }` с ack. Подписки на `type:id` считаются по
  ссылкам: вход у первого подписчика, `room:unsubscribe` — после последней отписки и
  только при подключённом сокете. Несколько экранов на одну комнату не выбивают друг
  друга.
- `socket.module.ts` — DI-регистрация.

## Gotcha

- Отказ сервера (`ok: false`) или `room:revoked { type, id }` — подписка прекращается,
  повторного входа и `onRejoin` нет.
- Подписка до подключения входит один раз по `connect`; `onRejoin` на первом
  подключении не вызывается — только на реальных переподключениях.
- Модели используют только `useSocketRoom`/`useSocketEvent`, не ручной `useEffect`.
- После переподключения экран перечитывает данные: события за время обрыва не
  доставляются.
