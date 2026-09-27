---
name: Path aliases
description: Актуальные path aliases проекта — 6 канонических алиасов Feature-Sliced Design
type: project
---

Алиасы объявлены в двух местах, синхронизируются вручную:

- `vite.config.ts` → `resolve.alias`
- `tsconfig.json` → `compilerOptions.paths`

| Алиас       | Путь           |
| ----------- | -------------- |
| `@app`      | `src/app`      |
| `@pages`    | `src/pages`    |
| `@widgets`  | `src/widgets`  |
| `@features` | `src/features` |
| `@entities` | `src/entities` |
| `@shared`   | `src/shared`   |

- Без `~`-префикса.
- Внутри слайса/сегмента — **только относительные пути**, свой же alias запрещён `boundaries/dependencies` (`eslint.boundaries.mjs`) — см. `ARCHITECTURE.md` → "Self-imports".
- DI: `@shared/lib/di`
- Холдеры: `@shared/lib/holders`
- Утилиты: `@shared/lib/utils`
- Бэкенды и codegen: `@shared/api` (типы генерации — `@shared/api/gen/main/model`);
  HTTP-движок — `@shared/lib/http`, сессия — `@shared/lib/session`
- Валидации авторизации (общие): `@entities/auth` (`loginValidation`, `passwordValidation`) — схема конкретной формы лежит в фиче (`@features/sign-in` и т.д.)
- UI-кит: `@shared/ui`
- Socket-контракт (Dependency Inversion): `@shared/lib/socket/contract` (`ITokenProvider`), реализация — `@entities/auth`
