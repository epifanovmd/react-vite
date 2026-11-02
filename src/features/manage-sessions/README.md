---
module: features/manage-sessions
summary: Список активных сессий и их завершение — по одной, всех остальных или выход везде.
---

# manage-sessions

Блок активных сессий пользователя на странице безопасности.

## Public API

| Экспорт       | Что                                            |
| ------------- | ---------------------------------------------- |
| `SessionList` | observer-список сессий с действиями завершения |

## Устройство

- `model/useManageSessionsVM.ts`:
  - при монтировании — `ISessionStore.load()`; список — `ISessionStore.sessionModels`;
  - `terminate(id)` → `ISessionStore.terminateSession(id)` (стор сам убирает сессию из списка и возвращает ошибку или `null`); `terminatingId` — для спиннера строки;
  - `terminateOthers` — `useMutation` над `ISessionStore.terminateOtherSessions()` (стор после успеха перезагружает список);
  - `signOutAll` — `useConfirm` → `IMainApi.signOutAll()` → `IAuthStore.signOut()`;
  - `isCurrent(id)` — `IAuthSessionGuard.isCurrentSession(id)`.
- `ui/SessionRow.tsx` — строка: устройство, IP, последняя активность; у текущей сессии бейдж «Это устройство» и нет кнопки «Завершить».
- «Завершить остальные» недоступна, пока сессий меньше двух.

## Зависимости

- `@entities/user` (`ISessionStore`, `SessionModel`), `@entities/auth` (`IAuthStore`).
- `@shared/api`, `@shared/lib/contracts` (`IAuthSessionGuard`), `@shared/lib/holders`, `@shared/lib/http`, `@shared/lib/notifications`, `@shared/lib/utils`, `@shared/ui`.
- Используется: `pages/security`.

## Gotcha

- После `signOutAll` выход локальный (`IAuthStore.signOut()`): все сессии на сервере уже завершены, повторный запрос не нужен.
