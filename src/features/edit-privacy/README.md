---
module: features/edit-privacy
summary: Настройка, кто видит аватар, телефон и время последнего визита.
---

# edit-privacy

Блок настроек приватности: для каждого поля — переключатель «Все / Контакты / Никто». Изменение сохраняется сразу, без кнопки «Сохранить».

## Public API

| Экспорт           | Что                                 |
| ----------------- | ----------------------------------- |
| `PrivacySettings` | observer-список полей с `Segmented` |

## Устройство

- `model/useEditPrivacy.ts`:
  - при монтировании — `IUserStore.loadPrivacy()`; данные — `IUserStore.privacy` (пока `null` — скелетон);
  - `change(key, value)` → `IUserStore.updatePrivacy({ [key]: value })`, тост успеха или `notifyApiError`;
  - `saving` — ключ поля, которое сохраняется; пока он не `null`, все переключатели заблокированы.
- `PRIVACY_FIELDS` и `PRIVACY_LEVEL_OPTIONS` (значения `EPrivacyLevel`) — константы в том же файле; это перечень полей в UI.

## Зависимости

- `@entities/user` (`IUserStore`).
- `@shared/api` (`EPrivacyLevel`, `PrivacySettingsDto`), `@shared/lib/http`, `@shared/lib/notifications`, `@shared/ui` (`Segmented`, `Skeleton`, `Spinner`).
- Используется: `pages/profile`.
