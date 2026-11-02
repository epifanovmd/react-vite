---
module: shared/lib/validation
summary: Хелперы Zod для форм — русская локаль сообщений, необязательное число, типизированный refine, boolean-discriminated union.
---

# validation

Общие строительные блоки Zod-схем форм, не привязанные к предметной области.

## Public API

| Экспорт                                                                                                     | Что                                                               |
| ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `applyZodLocale`                                                                                            | `z.config(z.locales.ru())` — русские стандартные сообщения        |
| `optionalNumber(schema)`                                                                                    | `schema.nullable().optional()` для поля числа                     |
| `refineFormField(schema, { field, message, check })`, `RefineFormFieldOptions`                              | sync/async-проверка с типизированным путём ошибки верхнего уровня |
| `createBooleanDiscriminatedUnion({ discriminator, enabled, disabled })`, `BooleanDiscriminatedUnionOptions` | `z.discriminatedUnion` из ветки `true` и ветки `false`            |

## Устройство

Четыре независимых файла, каждый — одна функция над `zod`.

## Зависимости

- Только `zod`.
- Потребители: `src/index.tsx` и `vitest.setup.ts` (`applyZodLocale`);
  `shared/ui/form/fields/NumberInputFormField.tsx` (`optionalNumber`);
  `features/{sign-up,reset-password,change-password,manage-two-factor}/model/validation.ts`
  (`refineFormField`); `pages/ui-kit-demo` (`createBooleanDiscriminatedUnion`).

## Gotcha

- `applyZodLocale` глобальный и вызывается один раз при старте; в тестах — в
  `vitest.setup.ts`, иначе сообщения будут английскими.
- `optionalNumber` нужен, потому что `NumberInputFormField` хранит пустое поле как `null`,
  а `z.number().optional()` принимает только `undefined` — форма с очищенным полем не
  отправится.
