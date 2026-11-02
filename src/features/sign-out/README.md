---
module: features/sign-out
summary: Кнопка выхода из аккаунта.
---

# sign-out

Нестилизованная кнопка «Выйти» с иконкой; внешний вид задаёт вызывающий через `className`.

## Public API

| Экспорт              | Что                                                             |
| -------------------- | --------------------------------------------------------------- |
| `SignOutButton`      | `<button type="button">` с иконкой и текстом «Выйти»            |
| `SignOutButtonProps` | атрибуты `<button>` без `type` + `onBeforeSignOut?: () => void` |

## Устройство

- `model/useSignOut.ts` — возвращает `() => IAuthStore.logout()`: запрос выхода на сервер (`notifyErrors: false`), затем локальная очистка сессии.
- Порядок по клику: `onBeforeSignOut?.()` → `signOut()` → пользовательский `onClick`.

## Зависимости

- `@entities/auth` (`IAuthStore`).
- `@shared/lib/utils` (`cn`).
- Используется: `widgets/app-layout` (`ProfileMenu`, `MobileMenu`).

## Gotcha

- `logout()` не дожидаются: `onClick` вызывается сразу, до ответа сервера.
