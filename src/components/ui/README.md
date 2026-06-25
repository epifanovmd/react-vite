# UI Kit

Token-driven component library. Design configuration lives in **tokens**, not in
component code — изменение бренд-цвета, радиуса или семантики делается в одном месте.

## Слои

```
ui/
  foundation/        ← сквозные примитивы дизайна (без JSX-компонентов)
    cn.ts                merge классов (clsx + tailwind-merge)
    controlSize.ts       CONTROL_HEIGHT / CONTROL_SQUARE — высота интерактивных контролов
    fieldVariants.ts     FIELD_BASE / FIELD_SIZE_* / FIELD_VARIANT_MAP — общая основа полей
    intent.ts            INTENT_SOLID / INTENT_SOFT — семантические цвета (primary/destructive/…)
    scrollIntoViewCenter.ts
    index.ts
  <component>/       ← по папке на компонент
  theme-toggle/
  index.ts           ← публичный barrel (единственная точка импорта снаружи)
```

Где что настраивается:

| Хочу поменять | Где |
|---|---|
| цвет/радиус/тень/тему | `src/styles/*.css` (CSS-переменные + `@theme inline`) |
| как выглядит семантический цвет (solid/soft) | `foundation/intent.ts` |
| высоту контролов (input/button/select…) | `foundation/controlSize.ts` |
| общую основу/состояния полей | `foundation/fieldVariants.ts` |

## Анатомия компонента

```
<component>/
  <Component>.tsx          forwardRef + Component.displayName
  <component>Variants.ts   cva(); тянет токены из ../foundation/*, НЕ хардкодит цвета/высоты
  types.ts                 если типов много или они переиспользуются
  hooks/                   если есть stateful-логика (useXxx)
  primitives/              если compound — под-части (Trigger/Content/Item…)
  index.ts                 ре-экспорт публичного API
```

Правила:

- **Примитив дизайна → `foundation/`, компонент → своя папка.** Корень `ui/` не
  должен обрастать «висячими» файлами.
- **Variants колоцируются** с компонентом в `<component>Variants.ts`. Внутри
  composе токены (`INTENT_SOLID`, `CONTROL_HEIGHT`, `FIELD_*`), а не повторяй
  классы. Компонент-специфичные добавки (hover/shadow/border) — локально.
- Каждый компонент — `forwardRef` + `displayName`.
- Новый компонент добавляется одной строкой в [index.ts](./index.ts).

## Добавление компонента (чек-лист)

1. `mkdir <component>/`, создать `<Component>.tsx` (forwardRef + displayName).
2. `<component>Variants.ts` — `cva()`, размеры из `CONTROL_HEIGHT`, цвета из
   `intent.ts`, поля из `fieldVariants.ts`.
3. `index.ts` в папке — ре-экспорт компонента, типов, variants.
4. Дописать экспорт в корневой [index.ts](./index.ts).
