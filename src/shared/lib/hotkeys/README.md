---
module: shared/lib/hotkeys
summary: Горячие клавиши — разбор сочетаний вида mod+shift+p, сопоставление с событием, хук для документа/элемента и подпись для UI.
---

# hotkeys

Единый механизм сочетаний клавиш: глобальные (`useHotkeys`), для конкретного поля
(`getHotkeyHandler`) и их отображение (`formatHotkey`).

## Public API

| Экспорт                                                            | Что                                                                         |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| `useHotkeys(bindings, { enabled?, target? })`, `UseHotkeysOptions` | подписка на `keydown` документа или элемента `target`                       |
| `getHotkeyHandler(bindings)`                                       | обработчик `onKeyDown` для элемента; в полях ввода срабатывает по умолчанию |
| `HotkeyBinding`, `HotkeyOptions`, `HotkeyEvent`                    | `[combo \| combo[], handler, { preventDefault?, allowInInputs? }]`          |
| `parseHotkey`, `Hotkey`                                            | строка → `{ key, code?, mod, ctrl, meta, alt, shift }`                      |
| `matchesHotkey`, `HotkeyModifierState`                             | совпадает ли событие с разобранным сочетанием                               |
| `formatHotkey`, `FormatHotkeyOptions`, `isApplePlatform`           | подпись `⇧⌘P` (Apple) / `Ctrl+Shift+P`                                      |
| `isEditableTarget`                                                 | цель — текстовое поле, `select` или `contenteditable`                       |

## Устройство

Поток: `use-hotkeys`/`get-hotkey-handler` → `run-hotkeys` (фильтр полей ввода и
IME-композиции, первый подходящий binding, `preventDefault` по умолчанию) →
`parse-hotkey` + `match-hotkey`.

- `mod` — Ctrl или Cmd, что нажато; остальные модификаторы сверяются строго.
- Клавиша совпадает по `event.key` или по физическому `event.code` (буквы, цифры,
  пунктуация) — работает в любой раскладке.
- `useHotkeys` читает bindings через latest-ref (inline-массив не переподписывает) и
  сверяет `target.current` после каждого коммита: появившийся позже элемент подхватывается.

## Зависимости

- `@shared/lib/hooks` (`useLatestRef`).
- Потребители: `shared/ui/command/use-command-shortcut.ts`, `shared/ui/textarea/use-textarea.ts`,
  демо в `pages/ui-kit-demo`.

## Gotcha

- `parseHotkey` бросает ошибку на неизвестный модификатор и пустую клавишу; сам `+`
  записывается как `plus`.
- `useHotkeys` по умолчанию игнорирует нажатия в полях ввода (нужен `allowInInputs`),
  `getHotkeyHandler` — наоборот, разрешает.
