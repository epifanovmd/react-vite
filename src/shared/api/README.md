---
module: shared/api
summary: Клиенты конкретных бэкендов (main — orval-генерация, dummyjson — рукописный) и их одинаковая DI-регистрация; сгенерированный код в gen/.
---

# api

Только реальные API. Движок — [shared/lib/http](../lib/http/README.md), токены —
[shared/lib/session](../lib/session/README.md).

## Public API

| Экспорт                                                       | Что                                     |
| ------------------------------------------------------------- | --------------------------------------- |
| `apiModule`                                                   | DI-регистрация всех бэкендов            |
| `IMainApi`, `IMainSession`, `IMainHttpClient`, `IMainAuthApi` | основной бэкенд                         |
| `IDummyJsonApi`, `IDummyJsonSession`, …                       | учебный бэкенд dummyjson.com            |
| `ApiClientDeps`                                               | `{ session, notifications }` для фабрик |
| типы DTO                                                      | `@shared/api/gen/main/model`            |

## Устройство

```
main/        orval-клиент: main.mutator.ts, main-auth.api.ts, main-session.ts,
             main-http-client.ts, main-device.ts (заголовки устройства), main.types.ts
dummyjson/   рукописный BaseApi: товары и auth/me; своя сессия на TokenSession
gen/         СГЕНЕРИРОВАНО orval — не редактировать (yarn generate)
api.module.ts, api.types.ts
```

Каждый бэкенд регистрируется одной четвёркой:

```
auth-API (обновление токенов) → сессия → HTTP-клиент → API
```

- Стек middleware: `main` — `notifyErrors → queryRace → bearerAuth`; `dummyjson` —
  `notifyErrors → retry → bearerAuth`.
- `main-session.ts`: `CrossTabTokenStorage(PersistentTokenStorage("app:refresh_token"), { channel: "app:tokens" })`,
  `lockName: "app:token-refresh"`, буфер 60 с; срок — `expiresIn` ответа.
- Сессия основного бэкенда связана с сокетным `ITokenProvider` через `toService`.
- Логин и refresh ходят по отдельному клиенту без `bearerAuth` и `notifyErrors` —
  иначе 401 самого refresh ушёл бы в рекурсию.
- `baseUrl` принимает геттер — стенд меняется в рантайме без пересборки.

## Новый бэкенд

- Генерируемый: `orval.config.ts` → `defineApi("<name>", { target })`, затем
  `<name>/<name>.types.ts` (DI-токены), `<name>.mutator.ts` (явная сигнатура из двух
  параметров — иначе orval не сгенерирует per-call `options`), `<name>-auth.api.ts`,
  `<name>-session.ts`, `<name>-http-client.ts` и четыре bind в `api.module.ts`.
- Рукописный — то же, но вместо генерации класс-наследник `BaseApi`; образец —
  `dummyjson/`.

## Gotcha

- `gen/` не редактируется и напрямую не тестируется. Регенерация — `yarn generate`
  (`MAIN_SWAGGER` — путь/URL спецификации).
- URL dummyjson — константа в слайсе, не `config/env`.
- DI-проводка покрыта `__tests__/api-module-wiring.test.ts`: контейнер собирается в
  тесте с заглушками `IStorageService` и `INotificationService`.
