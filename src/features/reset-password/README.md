---
module: features/reset-password
summary: Установка нового пароля по токену из письма сброса.
---

# reset-password

Форма нового пароля, открываемая по ссылке из письма восстановления. Токен передаёт страница.

## Public API

| Экспорт             | Что                                         |
| ------------------- | ------------------------------------------- |
| `ResetPasswordForm` | карточка формы; пропсы `token`, `onSuccess` |

## Устройство

- `model/useResetPasswordVM.ts` (`{ token, onSuccess }`) — `submit` → `IMainApi.resetPassword({ token, password })`; успех — `onSuccess()`, ошибка — текст в локальном `error`.
- Ошибка 4xx (например, устаревшая ссылка) выводится `Alert` над формой; сеть, таймаут,
  5xx и отмена в форму не попадают (`isHandledGlobally`) — их уже показал тост
  `notifyErrors`.
- `model/validation.ts` — пароль по `passwordValidation`, совпадение с повтором через `refineFormField`. У поля пароля `rules={{ deps: "confirmPassword" }}` — повтор перепроверяется при изменении пароля.

## Зависимости

- `@entities/auth` (`passwordValidation`).
- `@shared/api` (`IMainApi`), `@shared/lib/validation` (`refineFormField`), `@shared/ui` (`Card`, `Alert`, `Form`, `FormSubmit`).
- Используется: `pages/reset-password`.
