---
id: tech/aliases
title: Path aliases
summary: Шесть алиасов слоёв FSD, где объявлены, частые публичные пути shared-модулей.
layer: project
roles: [developer]
stages: [implementation]
depends_on: [architecture/dependencies]
---

# Path aliases

| Алиас       | Путь           |
| ----------- | -------------- |
| `@app`      | `src/app`      |
| `@pages`    | `src/pages`    |
| `@widgets`  | `src/widgets`  |
| `@features` | `src/features` |
| `@entities` | `src/entities` |
| `@shared`   | `src/shared`   |

- Объявлены в двух местах и синхронизируются вручную: `vite.config.ts`
  (`resolve.alias`, его же берёт `vitest.config.ts`) и `tsconfig.json` (`paths`).
- Без `~`-префикса.
- Внутри слайса или shared-модуля — только относительные пути
  ([architecture/dependencies](../20-architecture/dependencies.md#self-imports)).

## Частые публичные пути

| Что                         | Импорт                                                     |
| --------------------------- | ---------------------------------------------------------- |
| DI                          | `@shared/lib/di`                                           |
| холдеры                     | `@shared/lib/holders`                                      |
| HTTP-движок                 | `@shared/lib/http`                                         |
| сессия                      | `@shared/lib/session`                                      |
| сокет и его контракт        | `@shared/lib/socket`, `@shared/lib/socket/contract`        |
| права (грамматика)          | `@shared/lib/access`, фейк для тестов — `/testing`         |
| общие хуки                  | `@shared/lib/hooks`                                        |
| утилиты                     | `@shared/lib/utils`                                        |
| бэкенды и типы генерации    | `@shared/api`, `@shared/api/gen/main/model`                |
| UI-кит                      | `@shared/ui`                                               |
| общие валидации авторизации | `@entities/auth` (`loginValidation`, `passwordValidation`) |
