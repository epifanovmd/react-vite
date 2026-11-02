---
module: shared/ui
summary: UI-кит на Radix UI + cva + tailwind-merge — инвентарь компонентов, foundation, правила и gotcha кита.
---

# ui

Базовые компоненты без бизнес-смысла. Каждая папка — свой public API `index.ts`;
barrel `shared/ui/index.ts` — только явные именованные экспорты всех папок, кроме
`foundation`. Живая документация с примерами — маршрут `/ui`
([pages/ui-kit-demo](../../pages/ui-kit-demo/README.md)).

## Инвентарь

| Папка                                                                                                               | Что                                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `alert/`                                                                                                            | Alert: default/info/success/warning/destructive; `role="alert"` только у destructive/warning                                |
| `avatar/`                                                                                                           | Avatar (`xs`…`xl`, `status`), AvatarGroup                                                                                   |
| `badge/`                                                                                                            | Badge, BadgeAnchor (`dot`, sr-only `label`)                                                                                 |
| `button/`                                                                                                           | Button (`type="button"`, `loading`, `asChild`), AsyncButton, CopyButton; варианта `default` нет — `primary`                 |
| `card/`                                                                                                             | Card + Header/Title/Description/Content/Footer; шорткат `title/description/extra/footer`; `interactive="surface" \| "lift"` |
| `chart/`                                                                                                            | LineChart, AreaChart на visx; `referenceLines`, `bands`; палитра `--chart-1..8`                                             |
| `checkbox/`, `radio/`, `switch/`                                                                                    | подписи через `foundation/ChoiceLabel`; RadioGroup — `onValueChange`                                                        |
| `chip/`, `code-chip/`, `kbd/`                                                                                       | Chip (кликабельная часть — `<button>`), CodeChip, Kbd                                                                       |
| `collapse/`                                                                                                         | Collapse + `useCollapse`                                                                                                    |
| `command/`                                                                                                          | cmdk: Command*, CommandDialog, `useCommandShortcut`                                                                         |
| `copyable-text/`                                                                                                    | CopyableText                                                                                                                |
| `date-picker/`                                                                                                      | DatePicker, DateRangePicker, Masked*, Calendar, RangeCalendar, TimePicker; `withTime`                                       |
| `drawer/`, `modal/`                                                                                                 | Drawer (`direction`); Modal, ModalProvider, `useModal` (`confirm` → `Promise<boolean>`), `useConfirm`                       |
| `dropdown-menu/`, `context-menu/`                                                                                   | пункты из `foundation/menu-parts.ts`; шорткаты через `formatHotkey`                                                         |
| `empty/`, `error-boundary/`, `page-state/`                                                                          | Empty, ErrorBoundary (`resetKeys`), PageLoader/PageEmpty                                                                    |
| `file-drop/`                                                                                                        | FileDrop (`accept`, `maxSize`, `maxFiles`), FileDropList, `useFileList`                                                     |
| `form/`                                                                                                             | Form, FormField, `*FormField`-адаптеры, `useZodForm`, `dynamicZodResolver`                                                  |
| `icon-button/`                                                                                                      | IconButton (`aria-label` обязателен, `xs/sm/md/lg`), AsyncIconButton                                                        |
| `info-field/`, `labeled-field/`                                                                                     | InfoField (`emptyText`), LabeledField                                                                                       |
| `input/`, `textarea/`, `masked-input/`, `number-input/`, `otp-input/`                                               | поля ввода; Textarea — авторост, `onSubmitShortcut`                                                                         |
| `kanban/`                                                                                                           | Kanban + `useKanbanBoard/Card/Column`, WIP `limit`                                                                          |
| `page-header/`, `page-layout/`                                                                                      | PageHeader (`h1`), PageLayout (`header`, `lead`, `actions`)                                                                 |
| `pagination/`, `table/`, `virtual-list/`                                                                            | Pagination; Table (`use*Feature`, `TableRowActions`, `bulkActions`, `virtual`); VirtualList                                 |
| `popover/`, `tooltip/`, `scroll-area/`                                                                              | Popover (compound и standalone), Tooltip, ScrollArea (`viewportRef`)                                                        |
| `progress/`, `segmented/`, `separator/`, `skeleton/`, `slider/`, `spinner/`, `stat-card/`, `tabs/`, `theme-toggle/` | прочие примитивы; Segmented — дженерик, `fullWidth`                                                                         |
| `select/`                                                                                                           | Select, Autocomplete, GroupedSelect + стратегии `use{Static,Async,Controlled,Dependent,Eager,Infinite}Options`              |
| `foundation/`                                                                                                       | внутреннее: размеры, варианты полей, intents, ChoiceLabel, `INHERIT_FONT_CLASS`, `useAsyncClick`, ripple                    |

Общие хуки кита — `@shared/lib/hooks` (`useControllableState`, `useLatestRef`/`useEvent`,
`useMergedCallback`, `useInfiniteScrollSentinel`); горячие клавиши — `@shared/lib/hotkeys`.

## Правила кита

- Соседние компоненты внутри `shared/ui` — только относительными путями.
- Новый компонент — папка с `index.ts` и экспорт в barrel; пример — раздел в
  `pages/ui-kit-demo`.
- Подписи шорткатов — `formatHotkey`, не хардкод `⌘`.
- Наведение и переходы — утилиты движения ([app/styles](../../app/styles/README.md)),
  не ad-hoc `transition-*`.

## Gotcha

- `app/styles/index.css` задаёт голым `button`, `label`, `input` крупный кегль:
  вложенные элементы без `text-*` выбиваются — явный `text-*` или
  `INHERIT_FONT_CLASS`. `text-inherit` в Tailwind 4 — цвет, а не размер.
- `type="search"` рисует нативный крестик WebKit — `Input` скрывает его, очистка
  только через `clearable`.
- tailwind-merge: `max-h-none` и `max-h-[85vh]` конфликтуют — побеждает последний.
- Стратегии `select` — исключение из правила холдеров (работают вне `observer`).
- `VirtualList`: ref скролл-контейнера цепляется до первого измерения — порядок attach
  важен.
- `NumberInput` не пересинхронизирует черновик при внешнем изменении в фокусе.
- Тест перетаскивания канбана через DOM не написан (jsdom без layout).
