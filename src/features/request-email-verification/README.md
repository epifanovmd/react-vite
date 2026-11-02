---
module: features/request-email-verification
summary: Повторная отправка письма для подтверждения email.
---

# request-email-verification

Кнопка «Подтвердить» рядом с неподтверждённым email: запрашивает у сервера письмо с подтверждением.

## Public API

| Экспорт                          | Что                                |
| -------------------------------- | ---------------------------------- |
| `RequestEmailVerificationButton` | кнопка запроса письма со спиннером |

## Устройство

- `model/useRequestEmailVerification.ts` — `requestVerification` → `IUserStore.requestVerifyEmail()`; успех — тост «Письмо с подтверждением отправлено», ошибка — `notifyApiError`. `isLoading` — локальный `useState`, сбрасывается в `finally`.
- Решение, показывать ли кнопку, принимает страница.

## Зависимости

- `@entities/user` (`IUserStore`).
- `@shared/lib/http`, `@shared/lib/notifications`, `@shared/ui` (`Button`).
- Используется: `pages/profile`.

## Gotcha

- Ошибка 4xx (например, 429 «слишком часто») — тост с текстом сервера; `NetworkError` второго тоста не даёт (покрыто тестами).
