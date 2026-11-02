---
module: entities/user
summary: Текущий пользователь — профиль, роли, права (can/scope/canOn/accessKey), приватность, сессии устройств, реалтайм-события, PermissionGate.
---

# user

Доменные данные текущего пользователя. Аутентификация и токены — в
[entities/auth](../auth/README.md); грамматика прав — [shared/lib/access](../../shared/lib/access/README.md).

## Public API

| Экспорт                                                     | Что                                                |
| ----------------------------------------------------------- | -------------------------------------------------- |
| `IUserStore`                                                | профиль, роли, права, приватность                  |
| `ISessionStore`, `SessionModel`                             | активные сессии пользователя на других устройствах |
| `IUserRealtime`                                             | реакция на личные события сокета                   |
| `UserModel`, `ProfileModel`, `RoleModel`, `PublicUserModel` | модели DTO                                         |
| `PermissionGate`                                            | гейт по праву (или списку — любое) с заглушкой     |
| `UserAvatar`                                                | аватар пользователя                                |
| `ADMIN_PERMISSIONS`, `ALL_PERMISSIONS`, `Permission`        | права администрирования; реэкспорт грамматики      |
| `userModule`                                                | DI-регистрация                                     |

## Устройство

- `model/store.ts` — `UserStore` на `EntityHolder<UserDto>`; `load()` — `refresh()`,
  если данные уже есть.
- Права: `can(p)` — роль admin или `hasPermission`; `scope(p)` — admin → `all`, иначе
  `scopeIn`; `canOn(p, owners)` — `all`, либо `own` и `user.id` среди владельцев
  (`null/undefined` игнорируются); `accessKey` — `id|roles|permissions`, ключ
  мемоизации. Хелперы — `lib/permissions.ts` (`canAccess`, `resolveScope`, `isOwnedBy`).
- `model/session-store.ts` — `sessionsHolder` (CollectionHolder), `terminateMutation`,
  `terminateOtherSessions()`, `handleNewSession`/`handleSessionTerminated`.
- `model/realtime.ts` + `api/user-socket.ts` — `UserSocketService`: личные события;
  `user:privileges-changed` → `userStore.refresh()`.
- `reset()` у `UserStore` и `SessionStore` вызывает `AppDataStore` при выходе.

## Зависимости

`@shared/lib/{access,holders,socket,models,di}`, `@shared/api`; контракт
`IAuthSessionGuard` из `@shared/lib/contracts` (реализует `entities/auth`).

## Gotcha

- Завершение текущей сессии (`isCurrentSession`) или `sessionId: "all"` (аккаунт
  удалён) → принудительный `signOut()` через guard.
- `PermissionGate` при отзыве права на открытой странице показывает заглушку,
  `toast.warning` и зовёт `onDenied` (навигацию передаёт страница — entities не знают
  роутер); ошибка загрузки пользователя — `Empty` с ошибкой.
- `PermissionGate.test.tsx` использует свой MobX-фейк, а не `createFakeAccess`: нужна
  реактивность.
