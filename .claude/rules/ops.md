---
paths:
  - "Dockerfile"
  - "docker-compose.yml"
  - "Makefile"
  - "nginx.conf"
  - ".github/**"
  - "lefthook.yml"
  - "vite.config.ts"
  - ".env*.example"
---

# Инфраструктура

- Окружение, сборка, CI/CD, хуки — `docs/70-ops/`
  ([commands](../../docs/70-ops/commands.md), [environment](../../docs/70-ops/environment.md),
  [build-docker](../../docs/70-ops/build-docker.md), [ci-deploy](../../docs/70-ops/ci-deploy.md)).
- Деплой и действия на удалённых хостах — только по команде пользователя.
- Секреты и `.env*` (кроме `*.example`) не коммитятся.
