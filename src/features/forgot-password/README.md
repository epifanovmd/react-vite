---
module: features/forgot-password
summary: Запрос ссылки для сброса пароля по email или телефону.
---

# forgot-password

Форма восстановления пароля: пользователь вводит логин, сервер отправляет ссылку сброса; после успеха форма сменяется экраном «Письмо отправлено».

## Public API

| Экспорт              | Что                                                             |
| -------------------- | --------------------------------------------------------------- |
| `ForgotPasswordForm` | observer-карточка формы; проп `onBack` — возврат к экрану входа |

## Устройство

- `model/useForgotPasswordVM.ts` — `submit` → `IMainApi.requestResetPassword({ login })`; ошибка — `notifyApiError`, успех — `sent = true`.
- `model/validation.ts` — `login` — непустая строка (формат не проверяется).
- `ui/ForgotPasswordSuccess.tsx` — экран «Письмо отправлено» с кнопкой «Вернуться к входу» (`onBack`); пропсы — в `forgot-password-success.types.ts`.

## Зависимости

- `@shared/api` (`IMainApi`), `@shared/lib/http`, `@shared/lib/notifications`, `@shared/ui` (`Card`, `Form`, `FormSubmit`).
- Используется: `pages/forgot-password`.

## Gotcha

- При ошибке запроса экран «Письмо отправлено» не показывается — только тост (покрыто тестом).
