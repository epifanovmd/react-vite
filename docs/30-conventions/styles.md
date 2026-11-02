---
id: conventions/styles
title: Стили и UI
summary: Только design tokens и UI-кит, глобальные стили лишь в app, inline style только для динамики, статика не пересоздаётся в render.
layer: stack
roles: [developer, reviewer]
stages: [implementation, review]
depends_on: []
---

# Стили и UI

- Используются принятые design tokens и UI-кит; новый базовый компонент — в
  `shared/ui`, а не локальная копия.
- Глобальные стили — только в app-level styles; компонент не добавляет произвольный
  глобальный CSS.
- Inline style — только для действительно динамического значения; статическое
  оформление — принятым механизмом стилей.
- Статический стиль не пересоздаётся на каждом render.
- Эффекты наведения и переходы — из общих утилит движения, а не ad-hoc классами.

Конкретика стилей проекта — [app/styles](../../src/app/styles/README.md), инвентарь
UI-кита — [shared/ui](../../src/shared/ui/README.md).
