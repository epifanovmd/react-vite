---
module: shared/lib/webrtc
summary: DI-абстракция WebRTC-примитивов — peer connection, SDP offer/answer, ICE-кандидаты.
---

# webrtc

Платформенный адаптер над `RTCPeerConnection`. Медиапотоки — отдельная
ответственность, см. [media](../media/README.md).

## Public API

| Экспорт          | Что                                                                                                                   |
| ---------------- | --------------------------------------------------------------------------------------------------------------------- |
| `IWebRTCService` | DI-токен и контракт: `createPeerConnection`, `createOffer`, `createAnswer`, `setRemoteDescription`, `addIceCandidate` |
| `WebRTCService`  | веб-реализация                                                                                                        |
| `webrtcModule`   | `ContainerModule`: биндинг `IWebRTCService` → `WebRTCService` (singleton)                                             |

## Устройство

- `createPeerConnection(config?)` по умолчанию использует публичные STUN Google
  (`stun.l.google.com`, `stun1.l.google.com`); `config` мержится поверх, его
  `iceServers` заменяют дефолтные целиком.
- `createOffer`/`createAnswer` сразу вызывают `setLocalDescription` и возвращают SDP.

## Зависимости

- `@shared/lib/di`.
- Регистрация — `src/app/app.module.ts`. Потребителей `IWebRTCService` в коде сейчас нет.

## Gotcha

- TURN-серверов по умолчанию нет: за симметричным NAT соединение без своего `config` не установится.
