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

## Docker и деплой

`Dockerfile`: deps (`yarn install --ignore-scripts` — `prepare` = `lefthook install`, без git
в образе падает) → builder (`yarn build`, `VITE_*` из `.env.production`, поверх
`.env.production.local`) → `nginx:1.27-alpine` с `nginx.conf` (SPA-fallback на `index.html`,
`/assets` — `max-age=31536000, immutable`, `index.html` — `no-cache`, gzip). Порт контейнера 80,
на хосте — `APP_PORT`. `yarn prod` (vite preview) — только локальный предпросмотр.

`Makefile` (как в шаблоне бэкенда): настройки — `.env.deploy` (образец `.env.deploy.example`,
файл не в git; без него make останавливается с подсказкой), `make deploy` = rsync
(`.deployignore`) → `docker compose build` → `up` на хосте; `env` кладёт
`.env.production.local`; `status/logs/restart/down`.

## CI (.github/workflows/deploy.yml)

push в `main` или вручную: ssh-agent (секрет `SSH_PRIVATE_KEY`) → `.env.deploy` из образца с
`SSH_HOST=$DEPLOY_HOST` (переменная репозитория, по умолчанию 147.45.245.104) → `make deploy`.
