---
module: features/edit-profile
summary: Редактирование личных данных профиля (имя, фамилия, пол, дата рождения) в модалке.
---

# edit-profile

Модалка редактирования профиля текущего пользователя. Открытием/закрытием управляет вызывающая страница.

## Public API

| Экспорт            | Что                                                               |
| ------------------ | ----------------------------------------------------------------- |
| `EditProfileModal` | модалка; пропсы `open`, `onClose` (вызывается и после сохранения) |

## Устройство

- `model/useEditProfileVM.ts` (`{ open, onSuccess }`):
  - при каждом открытии форма заполняется из `IUserStore.user.profile` (`birthDate` — `parseISO`);
  - `submit` → `IUserStore.updateProfile(...)`: пустые строки уходят как `undefined`, дата — ISO; успех — тост и `onSuccess()`, ошибка — `notifyApiError`;
  - `useLeaveConfirmation` спрашивает подтверждение ухода со страницы, пока модалка открыта и форма изменена.
- `model/validation.ts` — все поля необязательные (`firstName`, `lastName`, `gender` — строки, `birthDate` — `Date`).
- `ui/edit-profile-modal.types.ts` — пропсы модалки.

## Зависимости

- `@entities/user` (`IUserStore`).
- `@shared/lib/navigation` (`useLeaveConfirmation`), `@shared/lib/http`, `@shared/lib/notifications`, `@shared/ui` (`Modal`, `Form`, `DatePickerFormField`, `AsyncButton`).
- Используется: `pages/profile`.

## Gotcha

- Очищенное поле в запрос не попадает: пустая строка превращается в `undefined` (`|| undefined`), то есть стереть значение этой формой нельзя.
