---
module: shared/config
summary: Конфигурация окружения — адреса API и Socket.IO, имя приложения и данные сборки из import.meta.env и define Vite.
---

# config

Единая точка чтения env-переменных Vite и констант сборки. Остальной код не обращается
к `import.meta.env` напрямую.

## Public API

Модуль без `index.ts`; импорт — `@shared/config/env`.

| Экспорт           | Что                                                                                     |
| ----------------- | --------------------------------------------------------------------------------------- |
| `BASE_URL`        | адрес API: в dev — `window.location.origin`, в сборке — `VITE_BASE_URL`                 |
| `SOCKET_BASE_URL` | адрес Socket.IO: в dev — origin, в сборке — `VITE_SOCKET_BASE_URL`                      |
| `APP_NAME`        | `VITE_APP_NAME`                                                                         |
| `WEB_BUILD`       | `{ version, commit, builtAt }` из `__APP_VERSION__`/`__APP_COMMIT__`/`__APP_BUILT_AT__` |

## Устройство

- В dev запросы идут на сам dev-сервер, а его прокси `/api` и `/socket.io` ведёт на
  `VITE_BASE_URL`/`VITE_SOCKET_BASE_URL`.
- `__APP_*` задаёт `define` в `vite.config.ts` (из `APP_VERSION`/`APP_COMMIT`/`APP_BUILT_AT`,
  версия по умолчанию — из `package.json`); типы — `src/vite-env.d.ts`.
- `VITE_*` встраиваются в статику при сборке — смена адреса требует пересборки.

## Зависимости

- Потребители: `shared/api/main/main-http-client.ts`, `shared/api/main/main-auth.api.ts`
  (`BASE_URL`), `shared/lib/socket/transport/socket.transport.ts` (`SOCKET_BASE_URL`),
  `widgets/app-layout/ui/AppLogo.tsx`, `widgets/auth-layout/ui/AuthLayout.tsx` (`APP_NAME`).

## Gotcha

- `commit` и `builtAt` — `null` вне Docker-образа (пустая строка из `define`).
