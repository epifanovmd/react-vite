# React Vite

Веб-панель поверх бэкенда `rest-api-template-app`: аккаунт, файлы, администрирование.
React 19, Vite 8, TypeScript, MobX + Inversify, TanStack Router, Tailwind CSS 4,
Socket.IO. Архитектура — [Feature-Sliced Design](https://feature-sliced.design).

## Быстрый старт

Нужны Node.js ≥ 22.12, Yarn 1 и запущенный бэкенд (`http://localhost:8181`).

```sh
yarn
cp .env.example .env.development
yarn dev            # http://localhost:3000
```

Перед merge — `yarn verify` (lint, формат, типы, тесты с покрытием,
сборка).

## Документация

| Что                                          | Где                                             |
| -------------------------------------------- | ----------------------------------------------- |
| индекс всех документов                       | [docs/README.md](docs/README.md)                |
| модули и их README                           | [docs/modules.md](docs/modules.md)              |
| этапы разработки, багфикс, git               | [docs/10-process/](docs/10-process/workflow.md) |
| архитектура и правила кода                   | `docs/20-architecture/`, `docs/30-conventions/` |
| продукт, экраны, права                       | `docs/60-domain/`                               |
| команды, окружение, Docker, CI/CD            | [docs/70-ops/](docs/70-ops/commands.md)         |
| как устроена документация и как её дополнять | [docs/00-meta/](docs/00-meta/doc-system.md)     |

Инструкции для Claude Code — [CLAUDE.md](CLAUDE.md).

## Лицензия

MIT
