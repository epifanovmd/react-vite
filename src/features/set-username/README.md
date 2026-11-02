---
module: features/set-username
summary: Установка и смена имени пользователя (@username).
---

# set-username

Форма имени пользователя с префиксом `@`; поле заполнено текущим значением.

## Public API

| Экспорт           | Что                               |
| ----------------- | --------------------------------- |
| `SetUsernameForm` | observer-форма имени пользователя |

## Устройство

- `model/useSetUsernameVM.ts` — форма с текущим `IUserStore.user.username`; при его изменении форма сбрасывается на новое значение. `submit` → `IUserStore.setUsername(username)`; успех — тост, ошибка — `notifyApiError`.
- `model/validation.ts` — trim + `toLowerCase`, затем `^[a-z0-9_]{5,32}$`. Тип формы — `z.input`.
- Кнопка «Сохранить» неактивна, пока форма не изменена (`isDirty`).

## Зависимости

- `@entities/user` (`IUserStore`).
- `@shared/lib/http`, `@shared/lib/notifications`, `@shared/ui` (`useZodForm`, `Form`, `InputFormField`).
- Используется: `pages/security`.

## Gotcha

- Регистр приводится схемой: введённое `John_Doe` уходит на сервер как `john_doe`.
