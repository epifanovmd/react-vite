---
module: shared/lib/access
summary: Грамматика прав — сопоставление с wildcard, область «все / свои», фейк доступа для тестов.
---

# access

Чистые функции прав, общие для `entities/user` и `entities/permission` (соседние
слайсы друг друга не видят). Модель —
[architecture/access](../../../../docs/20-architecture/access.md).

## Public API

| Экспорт                            | Что                                                                                     |
| ---------------------------------- | --------------------------------------------------------------------------------------- |
| `Permission`, `ALL_PERMISSIONS`    | право-строка; `*`                                                                       |
| `AccessScope`                      | `"all" \| "own"`                                                                        |
| `hasPermission(granted, required)` | точное право, wildcard (`a:b:c` ← `a:b:*` ← `a:*` ← `*`), право на все покрывает `:own` |
| `ownPermission("x:update")`        | `"x:update:own"`                                                                        |
| `scopeIn(granted, p)`              | `"all" \| "own" \| null`                                                                |
| `createFakeAccess` (`/testing`)    | фейк `IUserStore` с реальными правилами                                                 |

## Устройство

`permission-grammar.ts` — вся грамматика. `testing/` — фейк для тестов
потребителей: `createFakeAccess({ userId?, permissions? })` даёт
`can/scope/canOn/accessKey`, `user`, `roles: []`, `isAdmin: false`; полный доступ —
`permissions: ["*"]`.

## Gotcha

- Массив `permissions` фейка читается при каждом вызове: мутация в тесте (отзыв права)
  видна сразу; `accessKey` — геттер.
- Фейк `{ can: () => true }` не годится, если код зовёт `scope`/`canOn`/`accessKey`.
  Исключение — `PermissionGate.test.tsx`: там нужна MobX-реактивность, фейк свой.
