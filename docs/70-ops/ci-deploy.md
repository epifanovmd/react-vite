---
id: ops/ci-deploy
title: CI и деплой
summary: Workflow CI (verify на push/PR в main) и Deploy (SSH-деплой с хоста), переменные и секреты GitHub, ручной деплой make.
layer: project
roles: [devops]
stages: [verification, commit]
depends_on: [ops/build-docker]
---

# CI и деплой

## CI — `.github/workflows/ci.yml`

Push и PR в `main`:

- `verify`: install `--frozen-lockfile --ignore-scripts`, lint,
  format:check, typecheck, `test:coverage` (пороги — только с `--coverage`), сборка
  `--mode docker` с `.env.docker.example`;
- затем для push в `main` при заданной переменной `DEPLOY_ENV` — `deploy`
  (`uses: deploy.yml`, `secrets: inherit`). Запуски `main` не отменяются новым push.

## Deploy — `.github/workflows/deploy.yml`

`workflow_call` или вручную, только с `main`: checkout `fetch-depth: 0` →
`.env.deploy` из `DEPLOY_ENV` → ssh-agent (`SSH_PRIVATE_KEY`) → known_hosts из
`SSH_KNOWN_HOSTS` (без него — ssh-keyscan с предупреждением) → `make sync` (3 попытки)
→ секрет `PRODUCTION_ENV` в `ENV_FILE` и `make env` (без секрета — файл на хосте) →
`make build up`.

| Настройка GitHub  | Тип        | Что                                   |
| ----------------- | ---------- | ------------------------------------- |
| `DEPLOY_ENV`      | переменная | содержимое `.env.deploy`              |
| `SSH_PRIVATE_KEY` | секрет     | ключ доступа к хосту                  |
| `SSH_KNOWN_HOSTS` | секрет     | вывод `ssh-keyscan <хост>`, сверенный |
| `PRODUCTION_ENV`  | секрет     | содержимое `.env.production`          |

## Ручной деплой

```sh
cp .env.deploy.example .env.deploy   # хост, каталог, порт
make env                             # .env.production на хост
make deploy                          # sync → build → up (--remove-orphans)
make status | logs | restart | down
```

Исходники уходят rsync с исключениями `.deployignore`, образ собирается на хосте.
Деплой — действие с внешним эффектом: только по команде пользователя.
