---
name: Build & Environment
description: Команды сборки/lint/codegen, Docker (multi-stage), CI (GitHub Actions + SSH deploy)
type: project
---

## Commands (package.json)

```sh
yarn dev              # vite — dev server, http://localhost:3000 (VITE_PORT, default 3000)
yarn build             # vite build → dist/
yarn prod              # vite preview — проверить прод-сборку локально
yarn test              # vitest run (однократный прогон)
yarn test:dev          # vitest (watch)
yarn test:coverage     # vitest run --coverage (пороги — см. project_testing.md)
yarn typecheck         # tsc --noEmit
yarn lint / lint:fix   # eslint "**/*.{ts,tsx}" [--fix]
yarn prettier:fix       # prettier --parser typescript --write src/**/*.{ts,tsx}
yarn generate:orval     # orval --config ./orval.config.ts — регенерация src/shared/api/gen/
yarn check-packages-updates  # yarn outdated
```

## Requirements

Node >= 22.12.0, Yarn >= 1.22.18 (см. `engines` в `package.json`).

## Environment

`.env.development` / `.env.production` — `VITE_BASE_URL`, `VITE_SOCKET_BASE_URL`, `VITE_HOST`, `VITE_PORT`. Читаются `vite.config.ts` через `dotenv.config({ path: [".env.${NODE_ENV}", ".env"] })` и приложением через `src/shared/config/env.ts`.

## Git hooks

`husky` (`prepare: husky`), скрипт `precommit`: `lint-staged && tsc --noEmit && vitest run` — то есть перед коммитом гоняются и типы, и вся тестовая сюита. `lint-staged`: `*.{ts,tsx}` → `eslint --fix` + `prettier --write`; `*.{js,json,css,md,html,yml,...}` → `prettier --write`.

## Docker (Dockerfile — 3-stage build)

1. **deps** (`node:22-alpine`) — `COPY package.json yarn.lock` → `yarn install --frozen-lockfile`, отдельный слой для кэша.
2. **builder** — копирует `node_modules` из `deps`, весь исходник, `yarn build`. `VITE_*` переменные встраиваются в бандл на этом этапе (build-time, не runtime) — передаются через `build-args` в `docker-compose.yml`.
3. **runner** — копирует только `node_modules`, `dist/`, `package.json`, `vite.config.ts` и `src/app/routes` (нужны `vite preview`, т.к. `vite.config.ts` грузит `tanstackRouter()`, который на старте сканирует `routesDirectory` — без этой папки процесс не падает, но сыпет `ENOENT` в логи). Слушает `4173` (`vite preview`), `CMD ["yarn", "prod"]`.

Healthcheck: `wget -qO- http://127.0.0.1:4173/` — **обязательно `127.0.0.1`, не `localhost`**: на Alpine/musl `localhost` резолвится в `::1` (IPv6) раньше `127.0.0.1`, а сервер слушает только IPv4 (`0.0.0.0`) — с `localhost` healthcheck никогда не проходит, несмотря на рабочее приложение.

## docker-compose.yml

Один сервис `react-vite`, билдит `Dockerfile`, `env_file: .env.production`, порт `${APP_PORT:-3001}:4173`, `restart: unless-stopped`, отдельная bridge-сеть `react-net`.

## CI (.github/workflows/deploy.yml)

`Deploy with Docker Compose` — триггерится на `push`/`pull_request` в `master`. Шаги: checkout → `webfactory/ssh-agent` (SSH ключ из `secrets.SSH_PRIVATE_KEY`) → `ssh-keyscan` удалённого хоста (`REMOTE_HOST` env) → `make deploy ssh` (Makefile на репозитории/сервере разворачивает через `docker-compose` по SSH). Нет отдельного шага `lint`/`test`/`build` в CI — сборка происходит внутри Docker на удалённом хосте через `make deploy`.
