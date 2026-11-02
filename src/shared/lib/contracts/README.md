---
module: shared/lib/contracts
summary: Узкие DI-контракты для развязки слайсов одного слоя; сейчас — контракт текущей auth-сессии.
---

# contracts

Межслайсовые контракты, которые живут в shared, чтобы слайсы могли зависеть от
абстракции, а не друг от друга. Реализацию биндит слайс-владелец.

## Public API

| Экспорт             | Что                                                             |
| ------------------- | --------------------------------------------------------------- |
| `IAuthSessionGuard` | DI-токен и контракт: `isCurrentSession(sessionId)`, `signOut()` |

## Устройство

Только тип и токен (`auth-session-guard.contract.ts`), без реализации и без
`ContainerModule`. Реализация — `AuthSessionGuard` в `entities/auth/api/session-guard.ts`,
биндинг — `entities/auth/auth.module.ts`.

## Зависимости

- `@shared/lib/di`.
- Потребители: `entities/user/model/session-store.ts` (инъекция в стор),
  `features/manage-sessions/model/useManageSessionsVM.ts` (`useInstance()`).

## Gotcha

- Без зарегистрированного `authModule` токен не резолвится: модуль сам ничего не биндит.
