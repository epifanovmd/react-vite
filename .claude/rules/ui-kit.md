---
paths:
  - "src/shared/ui/**"
  - "src/app/styles/**"
  - "src/pages/ui-kit-demo/**"
---

# UI-кит и стили

- Внутри `shared/ui` — только относительные пути; новый компонент — папка с
  `index.ts`, экспорт в barrel, раздел в `pages/ui-kit-demo`.
- Кегль вложенных элементов — явный `text-*` или `INHERIT_FONT_CLASS`; движение —
  утилиты `motion.css`; `@source` в `index.css` — относительно файла.
- Инвентарь и gotcha — [shared/ui](../../src/shared/ui/README.md),
  [app/styles](../../src/app/styles/README.md).
