---
module: features/delete-account
summary: Удаление собственного аккаунта с подтверждением паролем.
---

# delete-account

Кнопка «Удалить аккаунт» с модалкой ввода пароля; после удаления — локальный выход.

## Public API

| Экспорт               | Что                                    |
| --------------------- | -------------------------------------- |
| `DeleteAccountButton` | кнопка + модалка подтверждения паролем |

## Устройство

- `model/useDeleteAccountVM.ts` — схема `deleteAccountSchema` (непустой пароль), форма, состояние модалки:
  - `openDialog` сбрасывает пароль и открывает модалку;
  - `submit` → `IUserStore.deleteMyAccount(password)`; при успехе закрывает модалку, тост, `IAuthStore.signOut()`.
- Ошибка — `notifyApiError`, модалка остаётся открытой.

## Зависимости

- `@entities/user` (`IUserStore`), `@entities/auth` (`IAuthStore`).
- `@shared/lib/http`, `@shared/lib/notifications`, `@shared/ui`.
- Используется: `pages/security`.

## Gotcha

- Выход — `IAuthStore.signOut()` (локальная очистка сессии без запроса к серверу), а не `logout()`: аккаунта на сервере уже нет.
