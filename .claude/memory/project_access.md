---
name: Access (права «все / свои»)
description: Грамматика прав в shared/lib/access, область all/own, IUserStore.scope/canOn/accessKey, матрица прав, createFakeAccess в тестах
type: project
---

## Грамматика — `@shared/lib/access` (`permission-grammar.ts`)

- `Permission` (строка), `ALL_PERMISSIONS` (`*`), `AccessScope = "all" | "own"`.
- `hasPermission(granted, required)`: точное право, wildcard-иерархия (`a:b:c` ← `a:b:*` ← `a:*` ← `*`) и правило **право на все покрывает `:own`** (`x:update` ⊃ `x:update:own`, не наоборот).
- `ownPermission("x:update")` → `"x:update:own"`; `scopeIn(granted, p)` → `"all" | "own" | null`.
- Грамматика в shared, потому что нужна и `entities/user`, и `entities/permission` (слайсы одного слоя друг друга не видят). `entities/user/lib/permissions.ts` реэкспортирует `Permission`/`ALL_PERMISSIONS` — старые импорты из `@entities/user` работают.

## `IUserStore`

- `can(p)` — как раньше (роль admin или `hasPermission`); `can(ownPermission(p))` — есть ли право хотя бы на свои.
- `scope(p)` — `resolveScope(roles, permissions, p)`: admin → `all`, иначе `scopeIn`.
- `canOn(p, owners)` — `all`, либо `own` и `user.id` среди `owners` (`isOwnedBy`; `null/undefined` в списке игнорируются). Владельцы — любые поля сущности (создатель, назначенный), решает вызывающий.
- `accessKey` — `id|roles|permissions`; ключ мемоизации для того, что зависит от прав (например, колонки таблиц с действиями в `useMemo`).

## Матрица прав — `entities/permission`

- `PermissionMatrix` (`value`, `onChange(next[])`, `readOnly`, `isLocked(name)`) вместо чекбоксов: `PermissionGroupCard` на группу каталога, `PermissionLevelControl` на действие — `Segmented` «Нет / Свои / Все» (radiogroup `"<группа>: <действие>"`) при `item.own`, иначе `Switch`.
- `lib/permission-levels.ts`: `levelOf` (уровень + `inherited`, если задан wildcard — тогда контрол disabled, подпись «через wildcard»), `setLevel` (действие с областью выше просмотра поднимает просмотр группы; понижение просмотра опускает действия), `applyPreset` (`full`, `view-all-edit-own`, `own`, `view-all`, `none`; остальные права набора не трогает), `hasScopedActions`. Просмотр группы — scoped-действие с именем на `:view`.
- Шаблоны группы — только если в группе есть scoped-действия, не `readOnly` и ни одно право не `isLocked`. Подсказка про «свои» — только если в каталоге есть scoped-группы.

## Каталог без `own` (gotcha)

- Сгенерированный `IPermissionCatalogItemDto` — `{ name, label }`; поле `own?` сервер отдаёт только с поддержкой области. Пока спецификация без него, в `entities/permission/model/types.ts` — локальные `IPermissionCatalogItem` (`own?: Permission`) и `IPermissionCatalogGroup`; `IPermissionCatalogStore.groups` типизирован ими. Без `own` матрица — обычные переключатели, без шаблонов.
- После `yarn generate:orval` со спецификацией, где есть `own?`, локальное расширение можно убрать и типизировать через DTO напрямую (поле совместимо).

## Тесты

- `createFakeAccess({ userId?, permissions? })` из `@shared/lib/access/testing` — фейк `IUserStore` с реальными правилами (`can/scope/canOn/accessKey`, `user`, `roles: []`, `isAdmin: false`); полный доступ — `permissions: ["*"]`. Массив `permissions` читается при каждом вызове — мутация в тесте (отзыв права) видна сразу; `accessKey` — геттер.
- Фейки вида `{ can: () => true }` не годятся, если код зовёт `scope`/`canOn`/`accessKey`. Исключение — `PermissionGate.test.tsx`: там нужна MobX-реактивность (observable-стейт), фейк свой.
