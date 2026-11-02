---
module: features/change-password
summary: Смена пароля текущего пользователя по старому паролю.
---

# change-password

Форма смены пароля: текущий пароль, новый и его повтор.

## Public API

| Экспорт              | Что                |
| -------------------- | ------------------ |
| `ChangePasswordForm` | форма смены пароля |

## Устройство

- `model/useChangePasswordVM.ts` — `useZodForm` + `submit` → `IUserStore.changePassword(currentPassword, newPassword)`. При успехе форма сбрасывается, тост «Пароль изменён. Остальные сессии завершены.»; при ошибке — `notifyApiError`.
- `model/validation.ts` — `changePasswordSchema`: новый пароль — `passwordValidation` из `@entities/auth`, совпадение с повтором — `refineFormField` (ошибка на поле `confirmPassword`).

## Зависимости

- `@entities/user` (`IUserStore`), `@entities/auth` (`passwordValidation`).
- `@shared/lib/validation` (`refineFormField`), `@shared/lib/http`, `@shared/lib/notifications`, `@shared/ui`.
- Используется: `pages/security`.

## Gotcha

- `NetworkError` второго тоста не даёт: его уже показал middleware `notifyErrors`, `notifyApiError` его пропускает (покрыто тестом). Ошибка 4xx — тост с текстом сервера.
