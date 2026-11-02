---
module: features/change-avatar
summary: Загрузка нового аватара профиля и его удаление.
---

# change-avatar

Аватар текущего пользователя с кнопками «Загрузить» и «Удалить». Файл загружается в хранилище, его id записывается в профиль.

## Public API

| Экспорт        | Что                                                                       |
| -------------- | ------------------------------------------------------------------------- |
| `ChangeAvatar` | observer-компонент: `UserAvatar` + скрытый `<input type="file">` и кнопки |

## Устройство

- `model/useChangeAvatar.ts` — две мутации `useMutation`:
  - `upload(file)`: `IMainApi.uploadFile({ file })` → id первого файла → `IUserStore.updateProfile({ avatarId })`;
  - `remove()`: `IUserStore.updateProfile({ avatarId: null })`.
- `avatarUrl` и имя берутся из `IUserStore` (`avatarUrl`, `model.displayName`); `isBusy` — любая из мутаций в работе.
- Успех — тост через `INotificationService`, ошибка — `notifyApiError`.
- Принимаемые форматы задаёт `accept` инпута: png, jpeg, webp, gif.

## Зависимости

- `@entities/user` — `IUserStore`, `UserAvatar`.
- `@shared/api` (`IMainApi`), `@shared/lib/holders` (`useMutation`), `@shared/lib/http` (`notifyApiError`), `@shared/lib/notifications`, `@shared/ui` (`IconButton`).
- Используется: `pages/profile`.

## Gotcha

- Пустой ответ загрузки без ошибки (`data: []`) считается ошибкой «Файл не загружен» — профиль не трогается (покрыто тестом).
- После выбора файла `input.value` сбрасывается, иначе повторный выбор того же файла не вызовет `change`.
- Кнопка удаления скрыта, пока идёт любая из мутаций.
