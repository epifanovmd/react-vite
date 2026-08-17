# CLAUDE.md

Messenger/admin panel. React 19 + Vite 8 + TypeScript, MobX 6 + Inversify 8 (DI), TanStack Router (файловый роутинг), Tailwind CSS 4, Socket.IO, RHF + Zod, orval (API codegen), Vitest.

## Команды

```sh
yarn dev            # dev server :3000
yarn typecheck      # tsc --noEmit
yarn lint / lint:fix
yarn test           # vitest run (watch: test:dev, coverage: test:coverage)
yarn build
yarn generate:orval # регенерация src/shared/api/gen/
```

Перед merge обязательны: lint + typecheck + test (это же гоняет pre-commit hook).

## Никогда не редактировать вручную

- `src/shared/api/gen/` — orval codegen
- `src/app/routeTree.gen.ts` — TanStack Router plugin

## Где что читать

| Вопрос                                                     | Документ                                                                     |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Слои FSD, границы импортов, public API, DI, ESLint-правила | [ARCHITECTURE.md](ARCHITECTURE.md)                                           |
| Куда положить новый код (decision tree)                    | [FSD-CHEATSHEET.md](FSD-CHEATSHEET.md)                                       |
| Именование файлов, компоненты, импорты, типы, хуки, тесты  | [CONVENTIONS.md](CONVENTIONS.md)                                             |
| Clean code, SOLID, паттерны                                | [CLEAN-CODE.md](CLEAN-CODE.md), [DESIGN-PRINCIPLES.md](DESIGN-PRINCIPLES.md) |
| Compound slots API                                         | [src/shared/lib/slots/README.md](src/shared/lib/slots/README.md)             |

Детальная память проекта (проверенные факты, gotcha, точные файловые карты) — [.claude/memory/MEMORY.md](.claude/memory/MEMORY.md): architecture, aliases, build, auth, holders, ui, routing, testing, patterns. Загружай тематический файл, когда работаешь в соответствующей области.

## Минимум, который надо знать всегда

- FSD: `app → pages → widgets → features → entities → shared`; импорты только вниз, слайсы одного слоя не видят друг друга (eslint-plugin-boundaries, 0 ошибок обязательны). Внутри слайса — только относительные пути (self-import через alias запрещён).
- DI: сторы — singleton, `IXxx.useInstance()` в React / `IXxx.getInstance()` вне React; биндинги в `<slice>.module.ts`, регистрация в `src/app/app.module.ts`. Обёрточных хуков нет.
- Async-состояние — только через холдеры `@shared/lib/holders` (TanStack-Query-like: useEntity/useCollection/usePaged/useInfinite/useMutation/usePolling), не ручной useState/useEffect-fetch.
- Все API-вызовы возвращают `{ data } | { error }`, исключения наружу не кидаются.
- `shared/lib/holders` покрыт тестами на 100% (порог в vitest.config.ts) — правка холдеров без тестов роняет coverage.
- Формы: React Hook Form + zodResolver; общие валидации — в `entities/auth`.
