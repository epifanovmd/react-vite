---
module: shared/lib/navigation
summary: Подтверждение ухода со страницы с несохранёнными изменениями — переходы TanStack Router и закрытие вкладки.
---

# navigation

Хук `useLeaveConfirmation` охраняет страницу с несохранёнными правками: переходы роутера
(ссылки, `navigate`, «назад») и `beforeunload`.

## Public API

| Экспорт                       | Что                                                                                                  |
| ----------------------------- | ---------------------------------------------------------------------------------------------------- |
| `useLeaveConfirmation`        | хук охраны; возвращает `{ withoutConfirmation(action) }`                                             |
| `UseLeaveConfirmationOptions` | `when`, `dialog`, `confirm`, `onConfirm`, `shouldBlock`, `blockSamePath`, `beforeUnload`, `disabled` |
| `LeaveConfirmation`           | тип результата хука                                                                                  |
| `LeaveConfirmDialog`          | тексты стандартного окна (подмножество `ModalConfirmOptions`)                                        |
| `LeaveTransition`             | аргумент `ShouldBlockFn` роутера                                                                     |

## Устройство

- Переходы — через `useBlocker` TanStack Router; подтверждение — `useConfirm()` из
  `shared/ui` с дефолтными текстами «Уйти со страницы?»/«Уйти»/«Остаться».
- `onConfirm` выполняется после согласия (например, сохранить): `false` — остаться.
- `withoutConfirmation` на время действия выключает охрану (переход после сохранения).

## Зависимости

- `@shared/lib/hooks`, `@shared/ui` (`useConfirm` — нужен `ModalProvider` выше по дереву),
  `@tanstack/react-router`.
- Потребитель: `features/edit-profile/model/useEditProfileVM.ts`.

## Gotcha

- `when` может быть функцией — читается в момент перехода; так удобно с MobX-флагами,
  которые меняются без ререндера.
- Смена только search/hash на том же `pathname` не охраняется, пока нет `blockSamePath`.
- `beforeunload` хук вешает сам (`enableBeforeUnload: false` у роутера): роутер ставит его
  только для browser history и не умеет читать условие в момент события.
- Пока открыт диалог, повторные переходы блокируются без второго окна.
