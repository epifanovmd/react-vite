---
module: features/manage-passkeys
summary: Список passkeys пользователя, добавление нового и удаление.
---

# manage-passkeys

Управление passkeys (вход без пароля) на странице безопасности: список ключей, регистрация нового через WebAuthn, удаление.

## Public API

| Экспорт       | Что                                                   |
| ------------- | ----------------------------------------------------- |
| `PasskeyList` | observer-список passkeys с кнопкой «Добавить passkey» |

## Устройство

- `model/useManagePasskeysVM.ts`:
  - список — `useCollection` над `IMainApi.getPasskeys({ limit: 50 })`, грузится при монтировании;
  - `add` — `useMutation`: `generateRegistrationOptions()` → `startRegistration` (`@simplewebauthn/browser`) → `verifyRegistration({ data })`; при успехе логин (`email ?? phone`) пишется в `IStorageService` под `PASSKEY_LOGIN_STORAGE_KEY`, тост, `list.refresh()`;
  - `remove(id)` — `useConfirm` → `IMainApi.deletePasskey(id)` → `list.removeItem(id)`;
  - `supported` — `browserSupportsWebAuthn()`; без поддержки вместо кнопки показывается текст.
- `ui/PasskeyList.tsx` — подписи типа ключа (`singleDevice`/`multiDevice`), даты добавления и последнего входа.

## Зависимости

- `@entities/auth` (`PASSKEY_LOGIN_STORAGE_KEY`), `@entities/user` (`IUserStore`).
- `@shared/api`, `@shared/lib/holders`, `@shared/lib/storage` (`IStorageService`), `@shared/lib/http`, `@shared/lib/notifications`, `@shared/lib/utils` (`formatter`), `@shared/ui` (`useConfirm`).
- `@simplewebauthn/browser`.
- Используется: `pages/security`.

## Gotcha

- Сохранённый в storage логин — то, по чему форма входа (`features/sign-in`) решает, показывать ли кнопку «Войти с passkey».
- Отмена системного диалога (`NotAllowedError`) возвращается как ошибка с `isCanceled` — `notifyApiError` её не показывает.
- Пустые параметры регистрации без ошибки и `verified: false` — ошибки («Сервер не выдал параметры passkey», «Сервер не подтвердил passkey»), логин не сохраняется (покрыто тестами).
