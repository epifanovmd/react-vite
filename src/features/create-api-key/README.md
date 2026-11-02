---
module: features/create-api-key
summary: Создание API-ключа с однократным показом секрета.
---

# create-api-key

Кнопка «Новый ключ» с модалкой: название, scopes, срок действия. После создания модалка показывает секрет, который сервер отдаёт один раз.

## Public API

| Экспорт              | Что                                                                 |
| -------------------- | ------------------------------------------------------------------- |
| `CreateApiKeyButton` | кнопка + модалка; проп `onCreated(apiKey: ApiKeyDto)` — ключ создан |

## Устройство

- `model/useCreateApiKeyVM.ts` — схема `createApiKeySchema`, форма и состояние модалки:
  - `openDialog` сбрасывает форму и прежний секрет;
  - `submit` → `IMainApi.createApiKey({ name, scopes, expiresAt })`; при успехе `secret = res.data.key`, вызов `onCreated(res.data.apiKey)`;
  - `setOpen(false)` игнорируется, пока запрос в работе (`submittingRef`).
- Валидация: `scopes` вводятся строкой через запятую/пробелы, схема превращает их в массив (`transform` + `pipe`) и проверяет каждый regex-ом `*` или `name[:action]`; минимум один scope. `expiresAt` — `Date`, уходит в ISO.
- Тип формы — `z.input` (строка scopes), обработчик получает `z.output` (массив).

## Зависимости

- `@shared/api` (`IMainApi`, `ApiKeyDto`), `@shared/lib/http`, `@shared/lib/notifications`, `@shared/ui` (`Modal`, `Form`, `DatePickerFormField`, `CopyableText`, `Alert`).
- Используется: `pages/admin-api-keys`.

## Gotcha

- Модалку нельзя закрыть во время создания: иначе ответ с секретом придёт в закрытое окно и секрет потеряется (покрыто тестом).
