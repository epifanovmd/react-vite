---
name: Build & Environment
description: Команды, порты, env-файлы и dev-прокси API/сокета, lefthook, Docker (BUILD_MODE, make local-*), Makefile, CI (ci.yml → deploy.yml), версия сборки
type: project
---

## Порты

| Что                                              | Адрес                   |
| ------------------------------------------------ | ----------------------- |
| бэкенд `rest-api-template-app` (API и Socket.IO) | `http://localhost:8181` |
| `yarn dev`                                       | `http://localhost:3000` |
| `make local-up` (nginx в Docker)                 | `http://localhost:4173` |

Три фронта на шаблоне разведены по портам и работают одновременно: react-vite —
8181 / 3000 / 4173, wg-admin-web — 8182 / 3001 / 4175, ml-labeling-web — 8183 / 3002 / 4174
(бэкенд / dev / Docker).

## Commands (package.json)

```sh
yarn dev                 # vite — dev server :3000
yarn build               # vite build → dist/ (--mode <mode> — другой .env.[mode])
yarn preview             # vite preview (алиас — yarn prod)
yarn verify              # lint + typecheck + test + build
yarn test / test:dev / test:coverage
yarn typecheck           # tsc --noEmit && tsc --noEmit -p tsconfig.node.json (vite/vitest/orval конфиги)
yarn lint / lint:fix     # eslint --cache (кэш — .eslintcache, в .gitignore)
yarn format / format:check  # prettier по проекту; игнор — .prettierignore + .gitignore
yarn generate            # = generate:orval: ../rest-api-template-app/src/routing/swagger.json или MAIN_SWAGGER=<url> → src/shared/api/gen/
yarn check-packages-updates
```

Сборочные пакеты (vite, плагины, tailwindcss) — в devDependencies; dotenv нет.

## Environment

- `.env.development` (из `.env.example`), `.env.development.local` (переопределения, напр.
  другой бэкенд), `.env.docker` (из `.env.docker.example`, для `make local-up`),
  `.env.production` (сервер) — вне git; в git — `.env.example`, `.env.docker.example`,
  `.env.deploy.example`.
- `vite.config.ts` читает env через `loadEnv(mode, root, "VITE_")` (`.env.[mode].local`
  поверх `.env.[mode]`); без `VITE_BASE_URL` / `VITE_PORT` — `DEFAULT_API_URL`
  (`http://localhost:8181`) и `DEFAULT_PORT` (3000). Экспортирует `alias` и `define` —
  их берёт `vitest.config.ts` (без mergeConfig, только плагин react).
- Типы env и `__APP_*__` — `src/vite-env.d.ts`.
- `src/shared/config/env.ts`: в dev (`import.meta.env.DEV`) `BASE_URL` и `SOCKET_BASE_URL` =
  `window.location.origin` — dev-сервер проксирует `/api` → `VITE_BASE_URL` и `/socket.io`
  (`ws: true`) → `VITE_SOCKET_BASE_URL`, CORS в dev не нужен. В сборке — `VITE_*` из env.
- `vite build --mode docker`: NODE_ENV = production → `DEV=false`, `PROD=true`, ветка сборки
  env.ts (адреса из `.env.docker`).

## Git hooks

`lefthook` (`prepare: lefthook install`, `lefthook.yml`): pre-commit — только изменённые
файлы: `*.{ts,tsx}` → `eslint --fix`, прочие → `prettier --write` (`stage_fixed`); pre-push —
параллельно `yarn typecheck` и `yarn test`.

## Docker и Makefile

`Dockerfile`: deps (`yarn install --ignore-scripts` — `prepare` = `lefthook install`, без git
в образе падает) → builder (`ARG APP_VERSION/APP_COMMIT/APP_BUILT_AT`, `ARG BUILD_MODE=production`
→ `yarn build --mode $BUILD_MODE`, `VITE_*` из `.env.$BUILD_MODE`) → `nginx:1.27-alpine` с
`nginx.conf` (SPA-fallback, `/assets` immutable, `index.html` no-cache, gzip). docker-compose:
build-arg `BUILD_MODE` (по умолчанию production), образ `react-vite:${TAG:-latest}`, порт
`${APP_PORT:-4173}:80`. `.dockerignore` пропускает `.env.production` и `.env.docker`,
режет прочие env, `*.md`, coverage, .tanstack, .github.

`Makefile` (`make help` — шапка файла до `LOCAL_GOALS`):

- `local-up | local-ps | local-logs | local-down` — без `.env.deploy`: `local-up` создаёт
  `.env.docker` из примера, собирает с `BUILD_MODE=docker`, `TAG=local`, порт `LOCAL_PORT`
  (4173);
- SSH-цели (`deploy = sync build up`, `env`, `sync`, `build`, `up`, `down`, `status`, `logs`,
  `restart`) подключают `.env.deploy` и без него останавливаются с подсказкой; `make env`
  кладёт на хост `ENV_FILE` (`.env.production`). `make` без цели — help.

## CI (.github/workflows/)

- `ci.yml` — push/PR в `main`: `verify` (install `--ignore-scripts`, lint, typecheck, test,
  сборка `--mode docker` с `.env.docker.example`); затем для push в `main` при заданной
  переменной `DEPLOY_ENV` — `deploy` (`uses: deploy.yml`, `secrets: inherit`).
- `deploy.yml` — `workflow_call` или вручную, только с `main`: checkout `fetch-depth: 0` →
  `.env.deploy` из `DEPLOY_ENV` (CRLF срезается) → ssh-agent (`SSH_PRIVATE_KEY`), ssh-keyscan с
  повторами → `make sync` (3 попытки) → секрет `PRODUCTION_ENV` в `ENV_FILE` и `make env` (без
  секрета — файл на хосте) → `make build up`.

## Версия сборки

`WEB_BUILD` (`@shared/config/env`) ← `define` в vite.config (`__APP_VERSION__`,
`__APP_COMMIT__`, `__APP_BUILT_AT__`) ← env сборки `APP_VERSION|APP_COMMIT|APP_BUILT_AT`, вне
её — версия package.json. Передаёт Makefile (`BUILD_INFO`: git describe, short SHA, дата) →
build args docker-compose.yml → `ARG` в Dockerfile.

## Gotcha

- В `src/shared/ui/**` соседние компоненты — только относительными путями: алиас
  `@shared/ui/...` изнутри сегмента — ошибка boundaries (self-alias import).
- `no-console` — error; исключения (ErrorBoundary, dev-предупреждения холдеров) —
  `eslint-disable-next-line no-console -- <причина>`.
