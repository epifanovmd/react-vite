---
module: features/change-email
summary: Смена email пользователя в два шага — новый адрес, затем код из письма.
---

# change-email

Форма смены email: пользователь вводит новый адрес, получает на него код и подтверждает им смену.

## Public API

| Экспорт           | Что                                                        |
| ----------------- | ---------------------------------------------------------- |
| `ChangeEmailForm` | observer-форма, переключается между шагами «адрес» и «код» |

## Устройство

- `model/useChangeEmailVM.ts` — две формы `useZodForm` (`emailForm`, `codeForm`) и локальный `pendingEmail`:
  - `requestChange` → `IUserStore.changeEmail(email)`; при успехе запоминает `pendingEmail`, сбрасывает форму кода, тост `info`;
  - `confirm` → `IUserStore.confirmEmailChange(code)`; при успехе сбрасывает `pendingEmail` и форму адреса;
  - `cancel` — только возврат к первому шагу (без запроса на сервер).
- UI показывает форму кода, пока `pendingEmail` не `null`; текущий адрес — `IUserStore.user.email`.
- `model/validation.ts` — `newEmailSchema` (email, trim) и `emailCodeSchema` (код, минимум 4 символа).
- Ошибки — `notifyApiError`.

## Зависимости

- `@entities/user` — `IUserStore`.
- `@shared/ui` (`useZodForm`, `Form`, `InputFormField`, `Button`), `@shared/lib/http`, `@shared/lib/notifications`.
- Используется: `pages/security`.

## Gotcha

- Шаг (`pendingEmail`) хранится в `useState` компонента: после перезагрузки страницы ввод кода начинается заново с первого шага.
