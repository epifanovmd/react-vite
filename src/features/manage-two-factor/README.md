---
module: features/manage-two-factor
summary: Включение и отключение двухфакторной защиты (второй пароль при входе).
---

# manage-two-factor

Настройки 2FA: второй пароль, который запрашивается после входа по основному, и необязательная подсказка к нему.

## Public API

| Экспорт             | Что                                                          |
| ------------------- | ------------------------------------------------------------ |
| `TwoFactorSettings` | переключатель «Включить / Отключить» и соответствующая форма |

## Устройство

- `model/useTwoFactorVM.ts` — `mode` (`"enable" | "disable"`) и две формы:
  - `enable` → `IMainApi.enable2FA({ currentPassword, password, hint })` (пустая подсказка уходит как `undefined`);
  - `disable` → `IMainApi.disable2FA({ currentPassword, password })`.
  - Успех — сброс формы и тост, ошибка — `notifyApiError`.
- `model/validation.ts` — `enableTwoFactorSchema`: второй пароль по `passwordValidation`, совпадение с повтором через `refineFormField`, подсказка до 100 символов; `disableTwoFactorSchema` — оба пароля непустые.

## Зависимости

- `@entities/auth` (`passwordValidation`).
- `@shared/api` (`IMainApi`), `@shared/lib/validation`, `@shared/lib/http`, `@shared/lib/notifications`, `@shared/ui` (`Segmented`, `Form`).
- Используется: `pages/security`.

## Gotcha

- Сервер не сообщает, включена ли 2FA, поэтому экран всегда предлагает оба действия; по умолчанию выбран режим «Включить».
- Подсказка показывается на экране входа (`features/sign-in`, `TwoFactorPrompt`).
