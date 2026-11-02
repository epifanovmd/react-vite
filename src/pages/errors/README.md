---
module: pages/errors
summary: Страницы ошибки роутера и 404.
---

# errors

Глобальные страницы ошибок: необработанная ошибка маршрута и «страница не найдена».

## Public API

| Экспорт        | Что                                                            |
| -------------- | -------------------------------------------------------------- |
| `ErrorPage`    | `ErrorRouteComponent`: текст ошибки, «На главную», «Повторить» |
| `NotFoundPage` | 404 с кнопками «Назад» / «На главную» и быстрыми ссылками      |

## Устройство

- Подключаются в `src/app/routes/__root.tsx` как `errorComponent` и
  `notFoundComponent` корневого маршрута.
- «Повторить» в `ErrorPage` — `reset()` и `router.invalidate()`.
- Быстрые ссылки `NotFoundPage` — `/profile` и `/ui` (UI Kit).

## Зависимости

- `@shared/ui` — `Button`.
- `@tanstack/react-router`.

## Gotcha

- Страницы занимают весь экран (`min-h-dvh`) и рендерятся без лейаутов `_app` /
  `_auth`. Ошибки внутри `_app` сначала ловит собственный `ErrorBoundary` лейаута
  (`src/app/routes/_app.tsx`).
