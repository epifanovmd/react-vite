---
module: app/styles
summary: Глобальные стили — вход Tailwind 4 (CSS-first), темы, токены, утилиты движения и их gotcha.
---

# styles

Единственное место глобальных стилей. Правила — [conventions/styles](../../../docs/30-conventions/styles.md).

## Устройство

```
index.css        вход Tailwind: @import "tailwindcss" source(none), темы, normalize, motion; @source; @theme inline
light-theme.css  CSS-переменные светлой темы (--background, --foreground, --primary, …, --chart-1..8)
dark-theme.css   то же для тёмной
motion.css       токены и утилиты движения, вид View Transitions
normalize.css    сброс
```

- `source(none)` отключает автосканирование; классы ищутся по явному
  `@source '../../**/*.{js,ts,jsx,tsx}'`.
- Темизация: переменные тем → `@theme inline { --color-*: var(--*) }` → классы
  `bg-background`, `text-foreground`; тёмная — `@custom-variant dark (&:is(.dark *))` и
  класс `.dark` на корне (`shared/lib/theme`).
- `--font-size: 16px` на `:root`; `html, body, #root { height: 100dvh }` — без этого
  процентные `h-full`-цепочки вложенных лейаутов схлопываются.

## Движение

Токены `--motion-fast/base`, `--motion-lift`, `--motion-zoom`, `ease-standard`.
Утилиты: `hover-surface` (рамка brand + оверлей accent через inset box-shadow),
`hover-lift`, `hover-zoom` (на ребёнке `.group`), `reveal-on-hover` (на touch видны
всегда). Все эффекты — внутри `@media (hover: hover)`; `prefers-reduced-motion` гасит
переходы, но не спиннеры. Ad-hoc `transition-* hover:*` для карточек и строк не
писать.

## Gotcha

- `@source` резолвится **относительно файла**, где написан. Перенос `index.css` без
  пересчёта пути молча ломает все стили без ошибки сборки.
- `@layer base` задаёт голым `button`, `label`, `input` `font-size: var(--text-base)` —
  вложенные элементы кита без `text-*` выбиваются (`INHERIT_FONT_CLASS`).
- Палитра `--chart-1..8` подобрана отдельно для светлой и тёмной темы с проверкой
  различимости при нарушениях цветового зрения и контраста — менять на глаз нельзя;
  девятая серия цвета не получает.
