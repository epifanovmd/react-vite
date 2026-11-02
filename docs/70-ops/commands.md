---
id: ops/commands
title: Команды проекта
summary: yarn и make — разработка, проверки, генерация, документация, Docker и деплой.
layer: project
roles: [all]
stages: [implementation, verification]
depends_on: []
---

# Команды проекта

Все команды — из корня репозитория.

## Разработка

| Команда                       | Что делает                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------- |
| `yarn dev`                    | dev-сервер Vite на :3000; `/api` и `/socket.io` проксируются на бэкенд          |
| `yarn build`                  | production-сборка в `dist/` (другой env — `yarn build --mode <mode>`)           |
| `yarn preview` (`yarn prod`)  | предпросмотр сборки из `dist/`                                                  |
| `yarn generate`               | клиент API и типы из OpenAPI (`src/shared/api/gen/`, `MAIN_SWAGGER` — путь/URL) |
| `yarn check-packages-updates` | устаревшие зависимости                                                          |

## Проверки

| Команда                        | Что делает                                                                       |
| ------------------------------ | -------------------------------------------------------------------------------- |
| `yarn verify`                  | всё перед merge: docs:check, lint, format:check, typecheck, test:coverage, build |
| `yarn lint` / `lint:fix`       | ESLint, включая границы слоёв / с автоисправлением                               |
| `yarn format` / `format:check` | Prettier по проекту                                                              |
| `yarn typecheck`               | tsc: приложение и конфиги сборки (`tsconfig.node.json`)                          |
| `yarn test`                    | тесты (Vitest)                                                                   |
| `yarn test:dev`                | тесты в watch                                                                    |
| `yarn test:coverage`           | тесты с покрытием и порогами                                                     |
| `yarn docs:check`              | проверка системы документации                                                    |
| `yarn docs:index`              | пересборка индексов `docs/README.md` и `docs/modules.md`                         |

Быстрая проверка итерации: `yarn lint && yarn typecheck` + `yarn vitest run <путь>`.

## Makefile — Docker и деплой

`make help` — список целей.

| Команда                                       | Что делает                                           |
| --------------------------------------------- | ---------------------------------------------------- |
| `make local-up`                               | production-сборка в Docker на этой машине (:4173)    |
| `make local-ps` / `local-logs` / `local-down` | состояние / журнал / остановить                      |
| `make deploy`                                 | исходники на хост, сборка образа там же, запуск      |
| `make env`                                    | env-файл сборки для сервера на хост                  |
| `make sync` / `build` / `up` / `down`         | исходники на хост / собрать / запустить / остановить |
| `make status` / `logs` / `restart`            | состояние / журнал / перезапуск на хосте             |

Цели `local-*` и `help` работают без `.env.deploy`, остальные требуют его.
Подробнее — [build-docker](build-docker.md), [ci-deploy](ci-deploy.md).
