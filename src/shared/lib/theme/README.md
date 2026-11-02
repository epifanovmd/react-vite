---
module: shared/lib/theme
summary: Светлая/тёмная тема — MobX-стор с сохранением выбора, системная схема и веб-адаптер, ставящий класс dark.
---

# theme

Хранит текущую тему (`light`/`dark`), переключает её и применяет к DOM через Tailwind-класс `dark`.

## Public API

| Экспорт                | Что                                                                          |
| ---------------------- | ---------------------------------------------------------------------------- |
| `IThemeStore`          | DI-токен и контракт: `theme`, `isDark`, `isLight`, `setTheme`, `toggleTheme` |
| `ThemeStore`           | реализация (MobX, `autoBind`)                                                |
| `ThemeMode`            | `"light" \| "dark"`                                                          |
| `IColorSchemeProvider` | DI-токен и контракт: `getPreferredScheme()`, `onSchemeChange(cb)`            |
| `ColorSchemeService`   | веб-реализация через `matchMedia("(prefers-color-scheme: dark)")`            |
| `ThemeProvider`        | `observer`-компонент: переключает класс `dark` на `<html>` по `isDark`       |
| `themeModule`          | `ContainerModule`: оба сервиса как singleton                                 |

## Устройство

- `ThemeStore` при создании читает ключ `theme` из `IStorageService`; если там не
  `light`/`dark` — берёт системную схему из `IColorSchemeProvider` и следит за её
  сменой (`onSchemeChange`).
- `setTheme`/`toggleTheme` — ручной выбор: пишет его в storage и прекращает слежение
  за системной схемой.
- Состояние живёт только в сторе; `ThemeProvider` — DOM side-effect без своего состояния.
  Подключён в `src/app/App.tsx` самым внешним провайдером.

## Зависимости

- `@shared/lib/di`, `@shared/lib/storage`, `mobx`, `mobx-react-lite`.
- Регистрация — `src/app/app.module.ts`.
- Потребители: `features/toggle-theme` (`ThemeToggle`, `ThemeMenuItem`).

## Gotcha

- Сохранённое значение имеет приоритет над системным: после первого ручного выбора
  тема больше не следует за ОС, в том числе после перезагрузки.
- Стор — singleton, подписка на системную схему живёт до ручного выбора.
