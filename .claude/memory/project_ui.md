---
name: UI Kit & Styling
description: shared/ui-инвентарь, Tailwind CSS 4 CSS-first конфиг (+ @source path gotcha), widgets (app-layout, auth-layout)
type: project
---

## shared/ui/ — инвентарь (каждая папка = свой Public API `index.ts`)

Barrel `shared/ui/index.ts` — только явные именованные экспорты, генерируется из
`*/index.ts` каждой папки (foundation в barrel не входит — это внутренний слой).

| Папка                                                                                                   | Что внутри                                                                                                                                                                                                                                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `alert/`                                                                                                | Alert: `variant` default/info/success/warning/destructive; role `alert` только для destructive/warning, иначе `status`                                                                                                                                                                                                                                            |
| `avatar/`                                                                                               | Avatar (`xs`…`xl`), AvatarGroup (fallback-инициалы с `role="img"`)                                                                                                                                                                                                                                                                                                |
| `badge/`                                                                                                | Badge (`span`), BadgeAnchor (`dot` + sr-only `label`)                                                                                                                                                                                                                                                                                                             |
| `button/`                                                                                               | Button (`type="button"` по умолчанию, `loading`, `aria-busy`, `asChild` через `@radix-ui/react-slot`), AsyncButton (через `useAsyncClick`); вариантов `default` нет — `primary`                                                                                                                                                                                   |
| `card/`                                                                                                 | Card + CardHeader/Title(`as`)/Description/Content/Footer; без compound и без `padding` — отступы у секций. **Шорткат** (`title`/`description`/`extra`/`footer`) сам собирает секции и кладёт children в `CardContent`; без шортката children рендерятся как есть (составная разметка)                                                                             |
| `chart/`                                                                                                | LineChart, AreaChart на примитивах visx по примеру «Areas»: `LinePath`/`Area`, `useTooltip` + `TooltipWithBounds` у точки + нижний `Tooltip` с подписью X, градиент, crosshair; серии внутри `ChartCanvas` через `ChartScalesContext`; клавиатура на overlay (←/→/Home/End/Esc)                                                                                   |
| `checkbox/`, `radio/`, `switch/`                                                                        | подписи через `foundation/ChoiceLabel` (`aria-describedby`); RadioGroup — forwardRef, `onValueChange`                                                                                                                                                                                                                                                             |
| `chip/`                                                                                                 | Chip (бывший Chips): кликабельная часть — `<button>`, удаление с aria-label                                                                                                                                                                                                                                                                                       |
| `code-chip/`, `kbd/`                                                                                    | CodeChip, Kbd                                                                                                                                                                                                                                                                                                                                                     |
| `collapse/`                                                                                             | Collapse + `useCollapse` (controllable, `keepMounted`)                                                                                                                                                                                                                                                                                                            |
| `copyable-text/`                                                                                        | CopyableText (`useClipboard` из @mantine/hooks)                                                                                                                                                                                                                                                                                                                   |
| `date-picker/`                                                                                          | DatePicker, DateRangePicker (`presets`), MaskedDatePicker, MaskedDateRangePicker, Calendar, RangeCalendar; `minDate/maxDate/disableDate`, `locale` (по умолчанию `ru`), `weekStartsOn`, controlled `open`; сетка дней — WAI-ARIA grid с roving tabindex                                                                                                           |
| `drawer/`                                                                                               | Drawer (`direction` top/bottom/left/right) + Content/Header/Body/Footer/Title/Description                                                                                                                                                                                                                                                                         |
| `empty/`                                                                                                | Empty (`icon: EmptyIconName \| ReactElement`)                                                                                                                                                                                                                                                                                                                     |
| `error-boundary/`                                                                                       | ErrorBoundary (`resetKeys`), ErrorFallback                                                                                                                                                                                                                                                                                                                        |
| `file-drop/`                                                                                            | FileDrop (проверка `accept` на drop + `onReject`)                                                                                                                                                                                                                                                                                                                 |
| `form/`                                                                                                 | Form, FormField, Field, FormSection, FormSubmit, 14 `*FormField`-адаптеров (через `splitFormAdapterProps` + `composeHandlers`), `useZodForm`, `dynamicZodResolver`                                                                                                                                                                                                |
| `foundation/`                                                                                           | внутреннее: CONTROL_HEIGHT, fieldVariants, INTENT_SOLID/SOFT/OUTLINE, `isInvalidVariant`, FieldClearButton, ChoiceLabel, `useActiveIndicator`, `useAsyncClick`, `dialog-parts`, ripple                                                                                                                                                                            |
| `icon-button/`                                                                                          | IconButton (**`aria-label` обязателен**, `loading`, размеры `xs` h-6 / `sm` h-8 (по умолчанию) / `md` h-10 / `lg` h-12 — шкала контролов), AsyncIconButton                                                                                                                                                                                                        |
| `info-field/`, `labeled-field/`                                                                         | InfoField (`emptyText`, 0 не прячется), LabeledField (`htmlFor` или `aria-labelledby`)                                                                                                                                                                                                                                                                            |
| `input/`, `textarea/`, `masked-input/`                                                                  | Input (`leftAddon/rightAddon`), Textarea (счётчик, autosize), MaskedInput + маски; `useMaskedInput` с `valueMode` masked/unmasked                                                                                                                                                                                                                                 |
| `kanban/`                                                                                               | Kanban + `useKanbanBoard/Card/Column`, WIP `limit`                                                                                                                                                                                                                                                                                                                |
| `modal/`                                                                                                | Modal + части, ModalProvider, `useModal` (`confirm` → `Promise<boolean>`), `useConfirm`, `useModalController`                                                                                                                                                                                                                                                     |
| `page-header/`, `page-layout/`, `page-state/`                                                           | PageHeader (`h1`), PageLayout, PageLoader/PageEmpty                                                                                                                                                                                                                                                                                                               |
| `pagination/`                                                                                           | Pagination + `usePagination` (окно по `maxVisible`)                                                                                                                                                                                                                                                                                                               |
| `popover/`                                                                                              | Popover (compound **и** standalone Trigger/Content/Anchor/Close/Portal/Arrow), `size="none"`                                                                                                                                                                                                                                                                      |
| `progress/`, `segmented/`, `separator/`, `spinner/`, `tabs/`, `tooltip/`, `stat-card/`, `theme-toggle/` | Segmented — radiogroup с клавиатурой, `onValueChange`, дженерик по типу значения из `options`, `fullWidth` (по умолчанию ширина по содержимому); ThemeToggleButton — презентационный, обёртка со стором в `features/toggle-theme`                                                                                                                                 |
| `select/`                                                                                               | Select, Autocomplete, GroupedSelect + стратегии `use{Static,Async,Controlled,Dependent,Eager,Infinite}Options` (ядро `useOptionsRequest`: abort + request-id, `error`, `enabled`; задокументированное исключение из правила holders — стратегии работают вне `observer`); движок `useSelectEngine`; триггер — `<button role="combobox">`, `aria-activedescendant` |
| `table/`                                                                                                | Table + `use*Feature` хуки, TablePagination, primitives; `meta.align` у колонки (left/center/right) выравнивает заголовок, ячейки и футер; `meta.label` — имя колонки для списка видимости                                                                                                                                                                        |

Вне shared: `AppLogo` → `widgets/app-layout/ui`, `ThemeToggle` → `features/toggle-theme`.
Удалены: `AuthFormCard` (формы auth на `Card`), `ButtonLink`, `Divider`, `Chart`/`Sparkline`, compound-формы Card/Tabs/Tooltip.

### Добавлены позже (второй проход)

- `dropdown-menu/`, `context-menu/` — общие классы пунктов в `foundation/menu-parts.ts`; шорткаты, checkbox/radio, sub-меню, `destructive`. `ThemeMenuItem` (features/toggle-theme) — пункт меню темы, используется в ProfileMenu.
- `command/` — cmdk: Command*, CommandDialog, `useCommandShortcut(onTrigger, { key, enabled })` — обёртка над `useHotkeys` (`mod+key`, `allowInInputs`).
- `@shared/lib/hotkeys` — горячие клавиши: `useHotkeys([[combo | combo[], handler, { preventDefault?, allowInInputs? }]], { enabled, target })`, `getHotkeyHandler` (для `onKeyDown`, поля ввода разрешены), `formatHotkey(combo)` (`⇧⌘P` на Apple / `Ctrl+Shift+P`), `parseHotkey`/`matchesHotkey`. `mod` = Ctrl ИЛИ Cmd на любой платформе; клавиша сверяется и по `key`, и по `code` (любая раскладка). Подписи `shortcut` у пунктов меню/Command строить через `formatHotkey`, не хардкодить `⌘`.
- `scroll-area/` — Radix ScrollArea, `viewportRef` для виртуализации.
- `skeleton/` — Skeleton, SkeletonText/Avatar/ListItem, SkeletonGroup (объявляет загрузку один раз).
- `virtual-list/` — VirtualList + `useVirtualList` (@tanstack/react-virtual), `scrollElementRef`, `onEndReached`, `gap`. Gotcha: ref скролл-контейнера цепляется до первого измерения — порядок attach важен (см. use-virtual-list).
- `otp-input/` — OtpInput/OtpInputCell/`useOtpInput`: `separator` (число/массив), `mask`, `mode`, paste/SMS autofill (`one-time-code` на первой ячейке).
- `number-input/` — `number | null`, ru-RU формат, степпер, clamp/precision на blur. Не пересинхронизирует draft при внешнем изменении в фокусе.
- `slider/` — дженерик по форме значения (число/массив), `marks`, `showValue`+`formatValue`, вертикальный.
- `input/` — `prefix`/`suffix` (паддинг меряется ResizeObserver). Floating-label Field не сдвигает prefix.
- `date-picker/` — TimePicker; DatePicker/MaskedDatePicker `withTime` + `timeStep`.
- `form/` — адаптеры OtpInput/NumberInput/Slider/TimePicker FormField.
- Расширения: select `creatable`/`virtual`; avatar `status`; table `bulkActions`, `useTableSettings` + `createLocalStorageTableSettings`, `virtual`; file-drop `maxSize`/`maxFiles`, `FileDropList`, `useFileList`, `validateFiles`; chart `referenceLines`/`bands`; modal `fullScreenOnMobile`, `size="full"`.
- Gotcha: `type="search"` рисует нативный крестик (WebKit) — `Input` скрывает его всегда (`[&::-webkit-search-cancel-button]:appearance-none`), очистка только через `clearable`.
- Gotcha tailwind-merge: `max-h-none` и `max-h-[85vh]` конфликтуют — последний класс побеждает, порядок в `cn` важен.
- `useModalController` в управляемом режиме выводит состояние из текущего конфига по сигнатурам (не из ref в рендере) — регрессионные тесты есть.

UI-примитивы построены на Radix UI + `class-variance-authority` + `tailwind-merge`/`cn`.
Общие хуки — в `shared/lib/hooks`: `useControllableState`, `useLatestRef`/`useEvent`,
`useMergedCallback`, `useInfiniteScrollSentinel`.

### Общая база с ml-labeling-web

`src/shared` в `ml-labeling-web` — та же база; правки shared переносить туда и держать идентичными.

- `PageLayout` — `header?`, `lead?`, `actions?` (`PageLayoutToolbar`), `contentClassName`; контент с `gap-3`.
- `@shared/lib/navigation` — `useLeaveConfirmation({ when, dialog, confirm, onConfirm, shouldBlock, blockSamePath, beforeUnload, disabled })` → `{ withoutConfirmation }`. Применён в `features/edit-profile`. В тестах переходы через `router.history.push` без `act`.
- `Textarea` — авторост `[minRows, maxRows]`, учёт рамки при border-box, `resize`, `clearable`, `onSubmitShortcut` (Mod+Enter). Очистка полей — `foundation/clearNativeField`.
- Графики: серии обрезаются по области (`ChartPlotArea`); подписи вертикальных `referenceLines` у правого края — слева от линии, вне обрезки.
- `Card`: заданный `contentClassName` оборачивает children в `CardContent` и без шортката.

### Движение (motion)

Единственный источник — `src/app/styles/motion.css` (импорт в `index.css`), одинаковый в react-vite и ml:
токены `--motion-fast/base`, `--motion-lift`, `--motion-zoom`, `ease-standard`; утилиты
`hover-surface` (рамка brand + оверлей accent через `inset box-shadow`, фон карточки не затирается),
`hover-lift` (рамка, `shadow-lg`, подъём), `hover-zoom` (на ребёнке `.group`), `reveal-on-hover`
(действия при hover/focus-within; на touch видны всегда). Все эффекты — внутри `@media (hover: hover)`.
`Card interactive="surface" | "lift"` (`foundation/INTERACTION`). Смена страниц — `defaultViewTransition: true`
в `createRouter`, вид в `::view-transition-*`. `prefers-reduced-motion` гасит переходы, но не спиннеры.
Не писать ad-hoc `transition-* hover:*` для карточек и строк — брать утилиту.

## Tailwind CSS 4 — CSS-first config

Точка входа — `src/app/styles/index.css`:

```css
@import "tailwindcss" source(none);
@import "tw-animate-css";
@import "./light-theme.css";
@import "./dark-theme.css";
@import "./normalize.css";

@source '../../**/*.{js,ts,jsx,tsx}';

@custom-variant dark (&:is(.dark *));
```

- `source(none)` на импорте `tailwindcss` отключает автосканирование Tailwind 4 — вместо этого явные `@source` директивы указывают, какие файлы сканировать на классы.
- **Gotcha**: `@source` резолвится **относительно файла, в котором он написан**, а не относительно корня проекта / рабочей директории сборки. `../../**/*.{js,ts,jsx,tsx}` от `src/app/styles/index.css` (`src/app/styles/`) поднимается на два уровня до `src/` и сканирует всё дерево `src/**/*`. Если этот файл переместить (например, `src/app/styles/index.css` → `src/app/index.css`) без пересчёта относительного пути — Tailwind перестанет видеть классы в компонентах, и это молча ломает стили без ошибки сборки. Это уже один раз ломало предыдущую миграцию — при переносе `styles/` проверяй `@source` в первую очередь.
- Палитра графиков — токены `--chart-1..8` (светлая и тёмная версии подобраны отдельно, не автоинверсией): фиксированный порядок слотов, девятая серия цвет не получает (`seriesColor` отдаёт серый — её нужно сворачивать в «Прочее»). Значения проверены на разделимость при CVD и контраст к поверхности карточки; менять их на глаз нельзя. Прежние `--chart-1..5` (две почти одинаковые жёлтые и серо-синяя) этих проверок не проходили и были заменены при добавлении `shared/ui/chart`.
- Темизация: `light-theme.css`/`dark-theme.css` определяют CSS custom properties (`--background`, `--foreground`, `--primary`, ...), `@theme inline { --color-* : var(--*) }` в `index.css` мапит их в Tailwind-токены (`bg-background`, `text-foreground`, ...). Переключение — `@custom-variant dark (&:is(.dark *))` + класс `.dark` на корне (см. `shared/lib/theme`, `ThemeProvider`/`ThemeToggle`).
- `--font-size: 16px` на `:root`; `html, body, #root { height: 100dvh }` — обязательное условие для процента-based `h-full`-цепочек во вложенных лейаутах (роуты не под `AppLayout`/`h-dvh` иначе схлопываются в page-level scroll).

## Widgets

- `widgets/app-layout/` — лейаут для аутентифицированных роутов (`_app.tsx`): `AppLayout`, `Header`, `HeaderNavItem`, `MobileMenu`, `ProfileMenu`, `model/useHeaderVM`, `model/constants.ts`.
- `widgets/auth-layout/` — лейаут для публичных auth-роутов (`_auth.tsx`): `AuthLayout` (единственный компонент).

Оба потребляют `entities/user`/`entities/auth` (текущий юзер, аватар, sign-out) и `shared/ui` — но не знают друг о друге (разные слайсы одного слоя).

## ui-kit-demo — документация в стиле UI-китов

`/ui/<section>`: `ui/UiKitLayout` (шапка, сайдбар с поиском и группами, мобильная
выдвижная панель, прокрутка контента к началу при смене раздела), `ui/UiKitSectionPage`
(хлебные крошки, заголовок, описание, примеры, пейджер назад/далее, «раздел не найден»).
Реестр `sections/index.ts` → `UI_SECTIONS` с `group` и `description`; порядок групп и
соседи — чистые функции `model/ui-kit-navigation.ts` (покрыты тестами). Новый раздел =
запись в `UI_SECTIONS`.

## ui-kit-demo — общие хелперы

`pages/ui-kit-demo/sections/shared/`: `DemoCard` (карточка секции), `DemoBlock`
(заголовок группы + содержимое, gap-2), `DemoRow` (`columns` 2|3), `DemoInline`
(строка с переносом), `DemoField`, `DemoGroupTitle`, `DemoEmittedValue`.
Локальные хелперы-компоненты в файлах секций не объявлять (один компонент на файл).
Большие секции — папкой: `sections/select/*` (+ `select-demo-data.ts`).

## Gotcha: глобальный кегль у button / label / input

`src/app/styles/index.css` (`@layer base`) задаёт голым `button`, `label`, `input`
`font-size: var(--text-base)`. Вложенные в поле/чип/строку элементы без явного `text-*`
получают крупный шрифт и выбиваются из контейнера. В ките: либо явный `text-*`, либо
`INHERIT_FONT_CLASS` (`[font:inherit]`) из `shared/ui/foundation` (уже на триггерах
Select/DatePicker, поисковом инпуте, кнопке сортировки таблицы, Chip). `text-inherit`
в Tailwind 4 — это цвет, а не размер.

## Визуальная проверка ui-kit-demo

Роут `/ui` публичный, секции — вкладки без URL. Проверка: `yarn dev --port 3100` +
headless Chrome через DevTools-протокол (Node 24 имеет `WebSocket`/`fetch`): клик по
`[role=tab]` с `aria-controls` на `-<value>`, `Page.captureScreenshot`, подписка на
`Runtime.consoleAPICalled` ловит предупреждения React (вложенные кнопки, порядок хуков).
Первый прогон сразу после правки может поймать устаревший модуль Vite — перепроверять.
