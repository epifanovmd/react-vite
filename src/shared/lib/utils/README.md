---
module: shared/lib/utils
summary: Чистые утилиты без React и DI — классы Tailwind, форматирование дат/размеров/длительностей, плюрализация, type guards, служебные типы.
---

# utils

Набор независимых функций и типов. Всё реэкспортируется через `index.ts` (`export *`).

## Public API

| Группа         | Экспорт                                                                                      | Что                                                                                                |
| -------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Стили          | `cn`                                                                                         | `twMerge(clsx(...))` — склейка классов Tailwind                                                    |
| Даты           | `formatter`, `DateFormatter`                                                                 | `formatter.date.format/formatDate/formatTime/formatChartTime/formatInputDate/formatDiff/isExpired` |
| Форматирование | `formatBytes`, `formatDuration`, `describeUserAgent`                                         | «12.3 МБ»; «2 ч 5 мин»; «Chrome, Mac OS X»                                                         |
| Плюрализация   | `pluralize`, `PluralParams`, `pluralizeDay/Hour/Minute`                                      | русские формы `one/few/many`, точные `_N`, `zero`                                                  |
| Строки, regex  | `stringCapitalize`, `stringUnCapitalize`, `EMAIL_REGEX`, `PHONE_REGEX`, `isEmail`, `isPhone` |                                                                                                    |
| Type guards    | `isString`, `isFunction`, `isArray`, `isPromise`                                             |                                                                                                    |
| Значения       | `LambdaValue`, `resolveLambdaValue`, `noop`                                                  | значение или функция от аргументов                                                                 |
| Объекты, enum  | `flattenObject`, `FlattenObject`, `getEnumNames`, `getEnumNamesAndValues`                    | плоский объект с camelCase-ключами; имена enum без числовых ключей                                 |
| Типы           | `DeepKeys`, `RecursiveObjectType`                                                            | пути вида `"a.b.c"`                                                                                |
| DOM            | `downloadBlob`, `scrollIntoViewCenter`, `joinIds`                                            | скачивание Blob; плавный скролл к центру; склейка id для `aria-*`                                  |

## Устройство

- `formatter` — синглтон-объект с вложенным `DateFormatter`; методы принимают ISO-строку
  (`null`/`undefined`/невалидная → пустая строка, `isExpired` → `false`).
- `pluralize-helper.ts` — общий `pluralize`, `pluralize.ts` — готовые обёртки для дней/часов/минут.

## Зависимости

- `clsx`, `tailwind-merge`, `date-fns`.
- Потребители: почти весь `shared/ui` (`cn`), `shared/lib/models`, `shared/lib/holders/filter`,
  `entities/*`, `features/*`, `pages/*`, `widgets/app-layout`.

## Gotcha

- `DateFormatter` вызывает `format` без локали: русские названия месяцев дают
  `setDefaultOptions({ locale: ru })` в `src/index.tsx`. В тестах без этой настройки — английские.
- `downloadBlob` отзывает object URL через 1 с: Firefox/Safari начинают загрузку
  асинхронно после `click()`.
- `formatBytes` не возвращает меньше «1 КБ» — для 0 байт тоже «1 КБ».
- `describeUserAgent` проверяет Edge и Opera раньше Chrome, Chrome раньше Safari —
  их User-Agent содержит подстроки друг друга.
