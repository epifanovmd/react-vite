---
id: ops/environment
title: Окружение и порты
summary: Требования, порты, env-файлы, как vite читает env, dev-прокси API и сокета, версия сборки.
layer: project
roles: [developer, devops]
stages: [implementation]
depends_on: []
---

# Окружение и порты

## Требования

Node.js ≥ 22.12, Yarn 1 (≥ 1.22.18), запущенный бэкенд `rest-api-template-app`,
Docker — для `make local-*`.

```sh
yarn
cp .env.example .env.development
yarn dev            # http://localhost:3000
```

## Порты

| Что                                              | Адрес                   |
| ------------------------------------------------ | ----------------------- |
| бэкенд `rest-api-template-app` (API и Socket.IO) | `http://localhost:8181` |
| `yarn dev`                                       | `http://localhost:3000` |
| `make local-up` (nginx в Docker)                 | `http://localhost:4173` |

Соседние фронты на том же шаблоне разведены по портам и работают одновременно.

## Env-файлы

Все `.env*` вне git, кроме `*.example`. `VITE_*` встраиваются в статику при сборке.

| Файл                     | Для чего                                                                      |
| ------------------------ | ----------------------------------------------------------------------------- |
| `.env.development`       | `yarn dev`: `VITE_BASE_URL`, `VITE_SOCKET_BASE_URL`, `VITE_HOST`, `VITE_PORT` |
| `.env.development.local` | локальные переопределения (другой бэкенд)                                     |
| `.env.docker`            | `make local-up` (создаётся из `.env.docker.example`)                          |
| `.env.production`        | сборка для сервера (на хост кладёт `make env` или CI)                         |
| `.env.deploy`            | параметры SSH-деплоя (из `.env.deploy.example`)                               |

## Как читается env

- `vite.config.ts`: `loadEnv(mode, root, "VITE_")` (`.env.[mode].local` поверх
  `.env.[mode]`); без `VITE_BASE_URL`/`VITE_PORT` — `http://localhost:8181` и 3000.
  Экспортирует `alias` и `define` для `vitest.config.ts`.
- Сборка в режиме ≠ development без `VITE_BASE_URL`, `VITE_SOCKET_BASE_URL`,
  `VITE_APP_NAME` падает сразу (`assertBuildEnv`).
- `src/shared/config/env.ts`: в dev `BASE_URL` и `SOCKET_BASE_URL` =
  `window.location.origin` — dev-сервер проксирует `/api` и `/socket.io` (`ws: true`)
  на бэкенд, CORS не нужен. В сборке — `VITE_*`.
- `vite build --mode docker`: `NODE_ENV=production` → ветка сборки, адреса из
  `.env.docker`.
- Типы env и `__APP_*__` — `src/vite-env.d.ts`.

## Версия сборки

`WEB_BUILD` (`@shared/config/env`) ← `define` (`__APP_VERSION__`, `__APP_COMMIT__`,
`__APP_BUILT_AT__`) ← env `APP_VERSION|APP_COMMIT|APP_BUILT_AT`, без них — версия
`package.json`. Значения передаёт Makefile (git describe, short SHA, дата) → build
args docker-compose → `ARG` в Dockerfile.
