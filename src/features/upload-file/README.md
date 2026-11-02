---
module: features/upload-file
summary: Загрузка файлов через API или напрямую в хранилище с прогрессом.
---

# upload-file

Область drag-and-drop для загрузки нескольких файлов с выбором способа («Через API» / «Напрямую») и индикатором прогресса.

## Public API

| Экспорт        | Что                                                                                         |
| -------------- | ------------------------------------------------------------------------------------------- |
| `FileUploader` | область загрузки; проп `onUploaded(file: IFileDto)` — вызывается на каждый загруженный файл |

## Устройство

- `model/useUploadFile.ts` (`{ onUploaded }`) — файлы загружаются последовательно, ошибка одного файла (тост `notifyApiError`) не прерывает остальные:
  - `regular`: `IMainApi.uploadFile({ file }, { onUploadProgress })`, берётся первый файл ответа;
  - `direct`: `IMainApi.createUpload({ name, size, contentType })` → `PUT` на `uploadUrl` с выданными `headers` → `IMainApi.completeUpload(fileId)`.
  - `progress` — `{ name, index, count, ratio? }`, `null` вне загрузки; пока он не `null`, переключатель способа заблокирован, а вместо `FileDrop` показан `UploadStatus`.
- `model/upload-status.ts` — `describeUpload(progress)`: текст стадии, «N из M» для пачки, флаг бегущей полосы.
- `ui/UploadStatus.tsx` — полоса `Progress`, стадия, номер и имя файла.

## Зависимости

- `@shared/api` (`IMainApi`, `IFileDto`), `@shared/lib/http` (`createHttpClient`, `notifyApiError`), `@shared/lib/holders` (тип `IApiResponse`), `@shared/lib/notifications`, `@shared/ui` (`FileDrop`, `Segmented`, `Progress`).
- Используется: `pages/files`.

## Gotcha

- Для прямой загрузки создан отдельный модульный `storageClient` (`createHttpClient({ baseUrl: "", timeout: 0 })`): без авторизации и тостов, с абсолютным адресом, ради прогресса отправки, которого нет у `fetch`.
- `ratio >= 1` — не «завис на 100%», а отдельная стадия «Обработка на сервере…» с бегущей полосой: файл отправлен, сервер его проверяет и сохраняет.
- Ошибка `PUT` в хранилище заменяется своим сообщением «Хранилище не приняло файл {name}».
