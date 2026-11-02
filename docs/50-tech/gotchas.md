---
id: tech/gotchas
title: Сквозные gotcha
summary: Неочевидное поведение, не привязанное к одному модулю — линтер, dev-сервер, загрузка чанков после деплоя.
layer: project
roles: [developer]
stages: [implementation, verification]
depends_on: []
---

# Сквозные gotcha

Gotcha одного модуля — в его README. Здесь — только сквозные.

- `no-console` — error. Исключения (ErrorBoundary, dev-предупреждения холдеров) —
  `eslint-disable-next-line no-console -- <причина>`.
- В `src/shared/ui/**` соседние компоненты — только относительными путями: алиас
  `@shared/ui/...` изнутри — ошибка boundaries (self-alias import).
- Vite dev-сервер иногда не подхватывает новый `routeTree.gen.ts` — перезапуск.
- Первый прогон после правки может отдать устаревший модуль Vite — перепроверять.
- `src/index.tsx`: `vite:preloadError` (старые чанки 404 после деплоя) →
  `preventDefault` + `location.reload()`; защита от цикла — время перезагрузки в
  sessionStorage (`app:preload-reload-at`, окно 10 с).
- Хуки холдеров без `watch` и без `autoLoad` сами не грузят — список молча пустой.
- Свежему клону без `.env.production` `yarn build`/`verify` не пройти: сборка вне
  development требует `VITE_*` ([ops/environment](../70-ops/environment.md)).
