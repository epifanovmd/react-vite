---
module: shared/lib/http
summary: HTTP-движок без знания эндпоинтов — клиент, пайплайн middleware, нормализованные ошибки, отмена, тестовый транспорт.
---

# http

Движок, на котором стоят все бэкенды `shared/api`. Не знает ни одного эндпоинта.
Импорт — только через `@shared/lib/http`.

## Public API

| Файл                    | Что                                                                          |
| ----------------------- | ---------------------------------------------------------------------------- |
| `core/types.ts`         | `HttpRequest`, `RequestOptions`, `RequestContext`, `ApiResponse`             |
| `core/http-client.ts`   | `HttpClient` + `IHttpClient` (`request` / `send`)                            |
| `core/middleware.ts`    | `HttpMiddleware`, `composeMiddleware` (луковица)                             |
| `core/errors.ts`        | `ApiError` и наследники, `toApiError`, `getErrorBody`                        |
| `core/cancelable.ts`    | `CancelablePromise`, `toCancelable`, `mapCancelable`                         |
| `core/base-api.ts`      | `BaseApi` — база рукописных API                                              |
| `core/transport.ts`     | контракт `HttpTransport`                                                     |
| `contract/`             | `ITokenSource` — порт для `bearerAuth`                                       |
| `middleware/`           | `bearerAuth`, `queryRace`, `retry`, `notifyErrors`, `withHeaders`, transform |
| `transport/`            | `AxiosTransport` (axios без interceptors)                                    |
| `testing/`              | `createFakeTransport`, `createTestClient` — тесты без сети                   |
| `create-http-client.ts` | `createHttpClient`                                                           |

Также `notifyApiError(notifications, error)` — показ ошибки 4xx экраном тостом;
`isHandledGlobally(error)` — ошибку уже показал `notifyErrors` или это отмена (для
экранов, которые выводят ошибку в форме).

## Пайплайн

`HttpClient.send` → middleware (первый в списке — самый внешний) → `HttpTransport`.
До `await next()` — правка запроса, после — ответа, `catch` вокруг — ошибки.
Повторный `next()` перезапускает только нижнюю часть (так сделаны retry и
401-refresh).

- `request()` не реджектится: `{ data } | { error }`. `send()` отдаёт полный ответ
  (статус, заголовки) и реджектится `ApiError`.
- Per-call options — второй аргумент любого метода API; middleware расширяют
  `RequestOptions` через declaration merging: `auth`, `queryRace`, `retry`,
  `notifyErrors`, плюс `headers`, `params`, `timeout`, `baseUrl`, `signal`.
- Ошибки: `HttpError` (`status`, `body`), `NetworkError`, `TimeoutError`,
  `CanceledError`, `UnknownApiError`; флаги `isServerError`/`isCanceled`/
  `isUnauthorized` — на базовом классе.
- Отмена — всегда `CanceledError` (`pending.cancel()`, `queryRace`, `options.signal`).
  `cancel` есть у результата; при цепочке `.then()` теряется — `mapCancelable`.

## Поведение middleware

- `notifyErrors` тостит только сеть, таймаут и 5xx. 4xx экран показывает сам:
  `notifyApiError` пропускает уже показанное и отменённое. В `useMutation` —
  `onError: error => notifyApiError(toast, error)`.
- `queryRace` — по умолчанию GET/HEAD: новый запрос гасит незавершённый с тем же
  методом и путём (query в ключ не входит). Параллельным запросам на один путь —
  `{ queryRace: false }`; изменяющим — только с `queryRace: true`.
- `bearerAuth` — `ensureFreshToken()` + `Authorization`; на 401 — refresh и один повтор.
  Запоздавший 401 со старым токеном при уже новом — повтор без refresh.
- Внешний `signal` и пауза `retry` снимают слушатели по завершении.

## Gotcha

- Заголовки клиента, запроса и вызова сливаются без учёта регистра.
- У тела `FormData` дефолтный `Content-Type` снимается — иначе axios сериализует
  форму в JSON и файл теряется. Явный `multipart/form-data` не трогается.
- Прогресс — `onUploadProgress`/`onDownloadProgress` → `{ loaded, total, ratio }`; с
  `retry` вместе не используется.
- Фабрики клиентов принимают `HttpTransport` вторым аргументом — в тестах туда
  заглушку, иначе тест уйдёт в сеть.
