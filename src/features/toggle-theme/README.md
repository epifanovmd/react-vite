---
module: features/toggle-theme
summary: Переключение светлой и тёмной темы.
---

# toggle-theme

Два представления одного действия — смены темы: отдельная кнопка и пункт выпадающего меню. Оба подключены к `IThemeStore`.

## Public API

| Экспорт            | Что                                                                |
| ------------------ | ------------------------------------------------------------------ |
| `ThemeToggle`      | observer-обёртка над `ThemeToggleButton` из `@shared/ui`           |
| `ThemeToggleProps` | пропсы `ThemeToggleButton` без `isDark` и `onToggle`               |
| `ThemeMenuItem`    | observer-пункт `DropdownMenuItem` («Светлая тема» / «Тёмная тема») |

## Устройство

- Слоя `model/` нет: компоненты берут `isDark` и `toggleTheme` прямо из `IThemeStore.useInstance()`.

## Зависимости

- `@shared/lib/theme` (`IThemeStore`), `@shared/ui` (`ThemeToggleButton`, `DropdownMenuItem`).
- Используется: `widgets/app-layout` (`MobileMenu` — `ThemeToggle`, `ProfileMenu` — `ThemeMenuItem`), `pages/ui-kit-demo` (`ThemeToggle`).

## Gotcha

- `ThemeMenuItem` вызывает `event.preventDefault()` в `onSelect`: меню не закрывается после переключения, чтобы был виден результат.
