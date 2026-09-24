---
name: plan-shared-ui-refactor
description: План и статус рефакторинга shared/ui (аудит → прод-готовность), что сделано и что осталось
type: project
---

# Рефакторинг shared/ui — статус на 2026-09-24

Задача пользователя: аудит всех компонентов `shared/ui`, рефакторинг до прод-уровня,
графики — только LineChart и AreaChart по официальному примеру visx «Areas».
Всё не закоммичено (рабочее дерево, ~530 изменённых файлов).

## Сделано и проверено (типы + тесты зелёные)

- **chart**: переписан на примитивах visx (`LinePath`/`Area`, `useTooltip` +
  `TooltipWithBounds` + нижний `Tooltip`, `LinearGradient`, `bisector`). Удалены
  `Chart`, `Sparkline`, столбцы. Зависимости: `@visx/tooltip`, `@visx/gradient`,
  `@visx/vendor`. Демо: `sections/charts/*`.
- **foundation + shared/lib/hooks**: `useControllableState`, `useLatestRef`/`useEvent`,
  `useMergedCallback` (без eslint-disable), `INTENT_OUTLINE`, `Intent`, `ControlSize`,
  `isInvalidVariant`, `FieldClearButton`, `useAsyncClick`, `ChoiceLabel`,
  `useActiveIndicator`, `dialog-parts.ts`, токен `bg-overlay`, keyframes
  `progress-indeterminate` в `app/styles/index.css`.
- **Примитивы** (alert…popover): отчёт агента — breaking: Alert `error→destructive`,
  Badge `danger/gray` удалены, `Chips→Chip` (`chip/`), `ButtonLink`/`Divider` удалены,
  IconButton `aria-label` обязателен, `enable/disable→success/warning`, Card без
  `padding` и compound, Progress `color→variant`, Tabs/Tooltip без compound,
  все неиспользуемые `*Variants` убраны из public API.
- **Композиты**: modal (своё open-state, confirm → `Promise<boolean>`, `confirm/` удалён,
  `useConfirm` из modal), drawer (`direction`, `DrawerBody`), pagination (алгоритм окна),
  error-boundary (`resetKeys`), file-drop, empty, `loaders/`→`page-state/`,
  `copyable/`→`copyable-text/`, collapse, info/labeled-field, page-header/layout,
  stat-card. FSD: `AppLogoLink`→`widgets/app-layout/ui/AppLogo`, `AuthFormCard` удалён,
  `ThemeToggle`→`features/toggle-theme` (+ `ThemeToggleButton` в shared).
- **input / textarea / form**: агент оборвался на финальной проверке, но типы и тесты
  его зоны зелёные (кроме одного теста DatePicker-адаптера — зависит от date-picker).
- **table / kanban**: агент оборвался на финальной проверке, типы и тесты зелёные.

## Статус: пункты 1–6 выполнены 2026-09-24

date-picker доведён (RangeCalendar, 4 пикера на `usePickerPopover`/`MaskedPickerField`),
select-тесты переписаны на поведенческие, barrel пересобран, `useMaskedInput` применяет
внешнее значение через экземпляр маски (фикс сброса в режиме unmasked).
Проверки: lint 0, typecheck 0, 117 файлов / 454 теста, build ок, `git diff --check` чист.

## Доработки 2026-09-24 (вторая итерация)

`onValueChange` у Segmented/RadioGroup (Segmented — дженерик), шкала IconButton
выровнена по контролам (`xs/sm/md/lg`, дефолт `sm`), `Button` без алиаса `default`,
`asChild` (+ `@radix-ui/react-slot` в package.json), Avatar `xs`, исключение holders
задокументировано в `select/strategies/use-options-request.ts`, тесты пяти адаптеров
форм, демо переведены на общие хелперы (SelectSection разнесён по файлам, отступы
в Tags & Badges). Проверки: lint 0, typecheck 0, 118 файлов / 460 тестов, build ок.

## Третья итерация 2026-09-24: сверка и визуальная проверка

Сверка форм и таблиц с аудитом (агенты) + исправление найденного; визуальный обход всех
31 секции `/ui` в тёмной и светлой теме. Исправлено: оси графиков (левый отступ по
длине подписей), Card (двойной отступ в составной разметке → StatCard, auth-формы,
ExampleCard), вложенные кнопки в multi-Select, кегль вложенных кнопок/инпутов
(`INHERIT_FONT_CLASS`), BadgeAnchor «99+», Segmented `fullWidth`, ChoiceLabel
выравнивание, Empty свой значок, LabeledField кегль, таблица `meta.align`, строка
таблицы при раскрытии, раскрытие групп, сторожевой ряд бесконечной прокрутки после
загрузки. Проверки: lint 0, typecheck 0, 122 файла / 477 тестов, holders 100%, build ок.

## Открыто (решение пользователя)

- Документация по CLAUDE.md отдельной задачей: общие хуки в `shared/lib/hooks`,
  foundation-примитивы, исключение holders для стратегий select.
- Тест перетаскивания в канбане через DOM не написан (jsdom без layout).
- Коммит: всё в рабочем дереве, не закоммичено.
