---
name: Testing (Vitest)
description: Vitest 4 + Testing Library setup, где лежат тесты, 100%-coverage порог на shared/lib/holders
type: project
---

## Setup

- `vitest.config.ts` — `mergeConfig(viteConfig, ...)`: наследует алиасы/плагины из `vite.config.ts`. `environment: jsdom`, `globals: true`, `setupFiles: ["./vitest.setup.ts"]`, `restoreMocks: true`. Include: `./src/**/*.{spec,test}.{ts,tsx}`.
- Стек: Vitest 4, @testing-library/react 16, @testing-library/jest-dom, jsdom.
- Команды: `yarn test` (run), `yarn test:dev` (watch), `yarn test:coverage`.
- Тесты гоняются в pre-commit (`precommit`: `lint-staged && tsc --noEmit && vitest run`) — падающий тест блокирует коммит.

## Где лежат тесты

Рядом с кодом в папках `__tests__/` (~70+ файлов): `shared/lib/holders/__tests__/`, `shared/ui/{select,input,textarea,segmented,foundation}/__tests__/` (у select — также в `strategies/`, `primitives/`, `hooks/`), `pages/ui-kit-demo/sections/forms/__tests__/`.

## Coverage — жёсткий порог на холдеры

`coverage.include` — ТОЛЬКО `src/shared/lib/holders/**` (исключая `index.ts`, `*.types.ts`, `__tests__/`), пороги 100/100/100/100 (statements/branches/functions/lines). Любое изменение в `shared/lib/holders` обязано сопровождаться тестами до полного покрытия — иначе `yarn test:coverage` падает.

## Конвенции

Тест проверяет наблюдаемое поведение, не реализацию; регрессионный тест при фиксе бага; сгенерированный код (`shared/api/gen`) напрямую не тестируется — см. `CONVENTIONS.md` §14.
