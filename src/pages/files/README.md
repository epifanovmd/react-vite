---
module: pages/files
summary: «Мои файлы» — загрузка, список с пагинацией и статусом обработки, удаление.
---

# files

Страница «Мои файлы»: загрузка и список своих файлов. Маршрут `/files`.

## Public API

| Экспорт     | Что                       |
| ----------- | ------------------------- |
| `FilesPage` | Компонент страницы файлов |

## Устройство

- Маршрут — `src/app/routes/_app/files.lazy.tsx` (периметр `_app`, прав не требует).
- VM `useFilesVM`: `usePaged` поверх `api.getMyFiles` (страница 20, `autoLoad`);
  удаление — `useDeleteFile`; после загрузки (`FileUploader.onUploaded`) — переход на
  первую страницу с refresh.
- Сокет без комнаты: `file:processed` — `updateItem` (статус, миниатюра);
  `file:uploaded` / `file:deleted` — перечитать текущую страницу.
- Статусы `EFileStatus` → подпись и цвет `Badge` — таблица `STATUS` в `FilesPage`.

## Зависимости

- `@features/upload-file`, `@features/delete-file`.
- `@shared/api`, `@shared/lib/holders`, `@shared/lib/socket` (`ISocketTransport`,
  `useSocketEvent`), `@shared/lib/hooks`, `@shared/lib/utils`, `@shared/ui`.

## Gotcha

- События за время обрыва сокета теряются, поэтому после переподключения список
  перечитывается — но не при первом подключении, если сокет ещё не был на связи при
  открытии страницы (оба случая покрыты тестами).
- Колонки получают VM через `useLatestRef` и не пересобираются.
