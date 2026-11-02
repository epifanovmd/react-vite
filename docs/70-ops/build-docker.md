---
id: ops/build-docker
title: Сборка и Docker
summary: Стадии Dockerfile, nginx и заголовки безопасности, docker-compose, режим сборки BUILD_MODE, цели make local-*.
layer: project
roles: [devops]
stages: [implementation, verification]
depends_on: [ops/environment]
---

# Сборка и Docker

```sh
yarn build          # статика в dist/ (VITE_* — из .env.production)
yarn preview        # локальный предпросмотр
make local-up       # то же в Docker с nginx: http://localhost:4173
```

## Dockerfile

1. **deps** — `yarn install --ignore-scripts` (`prepare` = `lefthook install`, без git
   в образе упал бы).
2. **builder** — `ARG APP_VERSION/APP_COMMIT/APP_BUILT_AT`, `ARG BUILD_MODE=production`
   → `yarn build --mode $BUILD_MODE`, `VITE_*` из `.env.$BUILD_MODE`.
3. **runtime** — `nginxinc/nginx-unprivileged:1.27-alpine`, без root, слушает 8080.

`nginx.conf`: SPA-fallback на `index.html`, `/assets` immutable, `index.html`
no-cache, gzip, `server_tokens off`. Заголовки nosniff / X-Frame-Options DENY /
Referrer-Policy — `always` и повторены в каждом `location`: `add_header` в location
отменяет серверные.

## docker-compose и make

- docker-compose: build-arg `BUILD_MODE` (по умолчанию production), образ
  `react-vite:${TAG:-latest}`, порт `${APP_PORT:-4173}:8080`.
- `.dockerignore` пропускает `.env.production` и `.env.docker`, режет прочие env,
  `*.md`, coverage, `.tanstack`, `.github`.
- `make local-up` создаёт `.env.docker` из примера, собирает с `BUILD_MODE=docker`,
  `TAG=local`, порт `LOCAL_PORT` (4173).
- `make help` — шапка Makefile до `LOCAL_GOALS`; `make` без цели — help.
