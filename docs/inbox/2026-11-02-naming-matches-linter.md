---
status: proposed
target: docs/30-conventions/naming.md
date: 2026-11-02
---

# Таблица именования файлов — как в линтере, включая тесты

## Ситуация

При рефакторинге тесты `UseHotkeys.test.tsx`, `UseLeaveConfirmation.test.tsx`,
`useInfiniteScrollSentinel.test.tsx` сочли нарушением и переименовали в kebab-case —
линтер (`eslint.naming.mjs`) отклонил: для `.tsx` без префикса-глагола он требует
PascalCase. В `naming.md` строка про тесты (`__tests__/<имя>.test.ts(x)`) не говорит,
какой регистр, а общая логика линтера (префикс `use|create|build` + заглавная →
camelCase, прочие `.tsx` → PascalCase, прочие `.ts` → kebab-case) не описана.

## Предложение

В `docs/30-conventions/naming.md`, раздел «Файлы», перед таблицей добавить:

> Регистр имени задаёт `eslint.naming.mjs` по трём правилам: имя на
> `use|create|build` + заглавную букву — camelCase и совпадает с экспортом
> (`useSignInVM.ts`, `createFormField.tsx`); прочие `.tsx` — PascalCase; прочие
> `.ts` — kebab-case. Средние расширения (`.test`, `.types`) не учитываются, поэтому
> тест компонента — `ComponentName.test.tsx`, тест модуля — `module-name.test.ts`.

Строку таблицы «тест» заменить на:

> | тест | имя по тем же правилам + `.test` | `__tests__/SignInForm.test.tsx`, `__tests__/store.test.ts` |

## Обоснование

Без явного описания расхождение документа и линтера повторяется при каждом
ревью и рефакторинге имён.
