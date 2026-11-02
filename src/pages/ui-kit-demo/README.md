---
module: pages/ui-kit-demo
summary: Публичная документация UI-кита на /ui — сайдбар с поиском и группами, страницы разделов с примерами.
---

# ui-kit-demo

Живая документация `shared/ui` в стиле UI-китов: маршруты `/ui` и `/ui/$section`
(публичные).

## Устройство

- `ui/UiKitLayout` — шапка, сайдбар с поиском и группами, мобильная панель, прокрутка
  к началу при смене раздела. `ui/UiKitSectionPage` — крошки, заголовок, описание,
  примеры, пейджер назад/далее, «раздел не найден».
- Реестр разделов — `sections/index.ts` → `UI_SECTIONS` (`group`, `description`).
  Порядок групп и соседи — чистые функции `model/ui-kit-navigation.ts` (с тестами);
  `use-current-section`, `use-section-search`.
- Общие хелперы — `sections/shared/`: `DemoCard`, `DemoBlock`, `DemoRow` (`columns`
  2|3), `DemoInline`, `DemoField`, `DemoGroupTitle`, `DemoEmittedValue`.

## Как добавить раздел

1. `sections/<Name>Section.tsx` (большой — папкой, как `sections/select/`).
2. Запись в `UI_SECTIONS`.

## Gotcha

- Локальные хелпер-компоненты в файлах секций не объявлять — один компонент на файл,
  общее — в `sections/shared/`.
- Визуальная проверка — обход всех разделов в обеих темах
  ([ops/live-testing](../../../docs/70-ops/live-testing.md)); предупреждения React
  ловить по консоли.
