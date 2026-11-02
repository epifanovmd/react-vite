---
module: features/delete-file
summary: Удаление своего файла с диалогом подтверждения.
---

# delete-file

Хук-действие удаления файла: подтверждение, запрос, уведомление вызывающего. UI у слайса нет — кнопку рисует страница.

## Public API

| Экспорт         | Что                                                                                      |
| --------------- | ---------------------------------------------------------------------------------------- |
| `useDeleteFile` | `({ onDeleted }) => (file: IFileDto) => Promise<boolean>` — удалить, вернуть «удалён ли» |

## Устройство

- `model/useDeleteFile.ts`: `useConfirm` (заголовок «Удалить файл?», описание — имя файла, destructive) → `IMainApi.deleteFile(file.id)` → `await onDeleted(file)`.
- Отказ в подтверждении или ошибка сервера → `false`; ошибка показывается через `notifyApiError`.
- `onDeleted` может вернуть промис — хук его дожидается (обновление списка до возврата `true`).

## Зависимости

- `@shared/api` (`IMainApi`, `IFileDto`), `@shared/lib/http`, `@shared/lib/notifications`, `@shared/ui` (`useConfirm`).
- Используется: `pages/files` (`useFilesVM`).
