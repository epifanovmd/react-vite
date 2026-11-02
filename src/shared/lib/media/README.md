---
module: shared/lib/media
summary: DI-абстракция доступа к медиаустройствам (getUserMedia, остановка потока).
---

# media

Платформенный адаптер над `navigator.mediaDevices`: получить медиапоток и остановить его.

## Public API

| Экспорт         | Что                                                                     |
| --------------- | ----------------------------------------------------------------------- |
| `IMediaService` | DI-токен и контракт: `getUserMedia(constraints?)`, `stopStream(stream)` |
| `MediaService`  | веб-реализация через `navigator.mediaDevices.getUserMedia`              |
| `mediaModule`   | `ContainerModule`: биндинг `IMediaService` → `MediaService` (singleton) |

## Устройство

- Без `constraints` запрашивается только аудио: `{ audio: true, video: false }`.
- `stopStream` останавливает все треки потока.
- Пара к [webrtc](../webrtc/README.md): там — peer connection/SDP/ICE, здесь — медиапотоки.

## Зависимости

- `@shared/lib/di`.
- Регистрация — `src/app/app.module.ts`. Потребителей `IMediaService` в коде сейчас нет.
