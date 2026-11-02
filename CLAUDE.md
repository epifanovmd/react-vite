# CLAUDE.md

Отвечать на русском.

Веб-панель поверх бэкенда `rest-api-template-app`: аккаунт, файлы, администрирование.
React 19 + Vite 8 + TypeScript, MobX 6 + Inversify 8 (DI), TanStack Router, Tailwind 4,
Socket.IO, RHF + Zod, orval, Vitest. Архитектура — Feature-Sliced Design.

## Система знаний

Всё знание о проекте — в одной системе ([устройство](docs/00-meta/doc-system.md)).
Документы не загружены в контекст: читать нужное по карте ниже.

| Нужно                                  | Где                                                               |
| -------------------------------------- | ----------------------------------------------------------------- |
| найти документ по теме, роли, этапу    | [docs/README.md](docs/README.md) — индекс                         |
| понять модуль, найти его по назначению | [docs/modules.md](docs/modules.md) → `src/<модуль>/README.md`     |
| порядок работы над задачей             | [process/workflow](docs/10-process/workflow.md)                   |
| исправить баг                          | [process/bugfix](docs/10-process/bugfix.md)                       |
| куда положить код                      | [architecture/placement](docs/20-architecture/placement.md)       |
| границы импортов                       | [architecture/dependencies](docs/20-architecture/dependencies.md) |
| как оформлять код                      | `docs/30-conventions/` — по теме из индекса                       |
| эталонный код модулей                  | [tech/recipes](docs/50-tech/recipes.md)                           |
| продукт, экраны, права                 | `docs/60-domain/`                                                 |
| команды, окружение, CI                 | [ops/commands](docs/70-ops/commands.md), `docs/70-ops/`           |
| git и коммиты                          | [process/git](docs/10-process/git.md)                             |
| противоречие или нет правила           | [meta/priority](docs/00-meta/priority.md)                         |

Правила области подгружаются автоматически при работе с её файлами
(`.claude/rules/`). Процедуры — skills: `/task`, `/bugfix`, `/review`, `/new-module`,
`/propose-rule`; только по команде пользователя — `/commit`, `/docs-edit`.
Роли-субагенты — `.claude/agents/` ([process/roles](docs/10-process/roles.md)).

## Этапы любой задачи

0. Приём → 1. Анализ (README модулей, документы из индекса) → 2. **План — показать и
   дождаться подтверждения** → 3. Итерации (после каждой — lint и typecheck) → 4. `yarn verify` → 5. Ревью diff → 6. README модулей, предложения в inbox → 7. Итог. Подробно — [process/workflow](docs/10-process/workflow.md).

## Инварианты

- **Ничего не выдумывать.** Место кода, паттерн, имя — по документам и рецептам. Нет
  правила или правила противоречат — остановиться и спросить, а не решать самому.
- FSD: `app → pages → widgets → features → entities → shared`; импорт только вниз,
  слайсы одного слоя не видят друг друга, внутри слайса — относительные пути,
  снаружи — через `index.ts` ([dependencies](docs/20-architecture/dependencies.md)).
- DI: сторы singleton, `IXxx.useInstance()` в React / `IXxx.getInstance()` вне React,
  биндинги в `<slice>.module.ts` → `src/app/app.module.ts`, без обёрточных хуков.
- Async-состояние — только холдеры `@shared/lib/holders`; API — `{ data } | { error }`
  без исключений наружу ([state](docs/20-architecture/state.md)).
- Все функции стрелочные, хелпер выше использования, дженерик в `.tsx` — `<T,>`
  ([functions](docs/30-conventions/functions.md)).
- **Багфикс через тест**: сначала тест, падающий на текущем коде, потом исправление;
  тест остаётся ([bugfix](docs/10-process/bugfix.md)).
- Не редактировать вручную: `src/shared/api/gen/`, `src/app/routeTree.gen.ts`.
- `shared/lib/holders` — порог покрытия 100%: правка только с тестами.
- Комментарии — только JSDoc к контрактам и неочевидное, без истории
  ([comments](docs/30-conventions/comments.md)).
- У каждого модуля — `README.md` рядом с кодом; изменил поведение или API —
  обнови README в той же задаче.
- Неиспользуемый существующий код — заготовка: не удалять без команды пользователя.
- Commit, push, merge, деплой — только по команде пользователя; коммиты —
  Conventional Commits на русском ([git](docs/10-process/git.md)).

## Защищённые правила

`CLAUDE.md`, `README.md`, `docs/**` (кроме `docs/inbox/`), `.claude/`, `scripts/{docs,git}`,
`lefthook.yml`, `eslint*.mjs` меняются **только по явному указанию пользователя**
([protection](docs/00-meta/protection.md)).

Повторяющаяся ситуация без правила, противоречие, устаревший факт в защищённом
документе, указание пользователя вида «всегда / никогда» — **предложить правило**:
файл в `docs/inbox/` по шаблону и пункт в итоговом сообщении (`/propose-rule`).

## Команды

```sh
yarn dev           # :3000, /api и /socket.io → бэкенд :8181
yarn lint && yarn typecheck   # после каждой итерации
yarn verify        # lint + format:check + typecheck + test:coverage + build
yarn docs:index    # пересобрать индексы документации
```
