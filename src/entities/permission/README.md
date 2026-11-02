---
module: entities/permission
summary: Каталог прав с сервера и матрица прав «Нет / Свои / Все» с шаблонами групп для редакторов ролей и прав пользователей.
---

# permission

Каталог подписей и групп прав и редактор набора прав.

## Public API

| Экспорт                                             | Что                                                        |
| --------------------------------------------------- | ---------------------------------------------------------- |
| `IPermissionCatalogStore`                           | каталог: `groups`, `isLoading`, `error`, `labelOf`, `load` |
| `IPermissionCatalogItem`, `IPermissionCatalogGroup` | алиасы DTO каталога (`own?` — право «только свои»)         |
| `PermissionMatrix`                                  | редактор набора прав                                       |
| `permissionModule`                                  | DI-регистрация                                             |

## Устройство

- Стор — singleton, каталог `GET /api/v1/permissions` грузится один раз (меняется
  только с деплоем); после ошибки — повторно. `labelOf` — подпись или само имя.
- `PermissionMatrix` (`value`, `onChange(next[])`, `readOnly`, `isLocked(name)`):
  `PermissionGroupCard` на группу, `PermissionLevelControl` на действие — `Segmented`
  «Нет / Свои / Все» (radiogroup `"<группа>: <действие>"`) при `item.own`, иначе
  `Switch`.
- `lib/permission-levels.ts`:
  - `levelOf` — уровень и `inherited` (задан wildcard → контрол недоступен, подпись
    «через wildcard»);
  - `setLevel` — действие с областью выше просмотра поднимает просмотр группы,
    понижение просмотра опускает действия;
  - `applyPreset` — `full`, `view-all-edit-own`, `own`, `view-all`, `none`; остальные
    права набора не трогает;
  - `hasScopedActions`. Просмотр группы — scoped-действие с именем на `:view`.

## Gotcha

- Шаблоны группы — только если в группе есть scoped-действия, матрица не `readOnly` и
  ни одно право не `isLocked`. Подсказка про «свои» — только если в каталоге есть
  scoped-группы.
- Без `own` в элементах каталога матрица — обычные переключатели без шаблонов.
