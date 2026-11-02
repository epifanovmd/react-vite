---
module: shared/lib/hooks
summary: Общие React-хуки без бизнес-логики — refs, controlled-состояние, буфер обмена, бесконечная прокрутка, горизонтальный скролл.
---

# hooks

Переиспользуемые хуки и ref-хелперы, на которых построены `shared/ui` и часть
`shared/lib` (hotkeys, navigation, socket).

## Public API

| Группа         | Экспорт                                                                                                | Что                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| Refs и колбэки | `useLatestRef`                                                                                         | ref со свежим значением (обновляется в `useLayoutEffect`)                   |
|                | `useEvent`                                                                                             | стабильная identity, тело всегда свежее                                     |
|                | `useMergedCallback`                                                                                    | один стабильный колбэк, зовущий все переданные по очереди                   |
|                | `mergeRefs`                                                                                            | callback-ref, раздающий значение в несколько refs                           |
| Состояние      | `useControllableState`, `StateUpdater`, `UseControllableStateOptions`                                  | controlled/uncontrolled в одном контракте                                   |
|                | `useBoolean`                                                                                           | `[value, setTrue, setFalse]`                                                |
| UI-поведение   | `useClipboard`, `copyToClipboard`, `UseClipboardOptions`                                               | копирование с `copied`/`error`; фолбэк без Clipboard API                    |
|                | `useCloseWhenForbidden`                                                                                | закрыть открытое окно, когда `allowed` стал `false`                         |
|                | `useInfiniteScrollSentinel`, `UseInfiniteScrollSentinelOptions`, `DEFAULT_INFINITE_SCROLL_ROOT_MARGIN` | ref-sentinel на `IntersectionObserver` для подгрузки                        |
|                | `useSmoothHorizontalScroll`, `UseSmoothHorizontalScrollResult`                                         | колесо мыши → плавный горизонтальный скролл + `scrollToCenter/By/Start/End` |

## Устройство

- `useControllableState`: сеттер всегда зовёт `onChange`, внутреннее состояние
  меняет только в неуправляемом режиме; функциональные апдейтеры в одном тике
  накапливаются через ref (покрыто тестом).
- `useInfiniteScrollSentinel`: колбэк и флаг загрузки читаются через latest-ref —
  смена `onLoadMore` не пересоздаёт observer; без `hasNextPage` observer не создаётся.
- `useSmoothHorizontalScroll` вешает `wheel` с `passive: false` и перехватывает только
  вертикальное колесо, когда контент шире контейнера.

## Зависимости

Только `react`. Потребители: `shared/ui` (select, table, modal, date-picker, virtual-list и др.),
`shared/lib/hotkeys`, `shared/lib/navigation`, `shared/lib/socket/hooks`, ряд `pages` и
`entities`.

## Gotcha

- `copyToClipboard`: на http (не secure context) Clipboard API нет — копируется через
  скрытый `textarea` и `execCommand("copy")`. Внутри модалки передавайте `container`:
  ловушка фокуса не даст выделить поле в `body`.
- `useInfiniteScrollSentinel` после окончания загрузки вручную переподписывает
  observer: если sentinel всё ещё в зоне, `IntersectionObserver` сам повторно не сработает.
- `useLatestRef` обновляет ref в layout-эффекте — во время рендера там предыдущее значение.
