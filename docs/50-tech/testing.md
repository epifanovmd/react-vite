---
id: tech/testing
title: Тестовая инфраструктура
summary: Vitest + Testing Library на jsdom, где лежат тесты, порог покрытия 100% на холдеры, фейки транспорта и доступа, gotcha.
layer: project
roles: [developer, tester]
stages: [implementation, verification]
depends_on: [conventions/tests]
---

# Тестовая инфраструктура

## Настройка

- `vitest.config.ts` — без `mergeConfig`: плагин react + `alias`/`define`,
  экспортированные из `vite.config.ts`. `environment: jsdom`, `globals: true`,
  `setupFiles: ["./vitest.setup.ts"]`, `restoreMocks: true`, include —
  `./src/**/*.{spec,test}.{ts,tsx}`.
- Стек: Vitest 4, @testing-library/react 16, @testing-library/jest-dom, jsdom.
- Команды — [ops/commands](../70-ops/commands.md#проверки). Тесты идут на pre-push и
  в CI.

## Порог покрытия

`coverage.include` — только `src/shared/lib/holders/**` (без `index.ts`,
`*.types.ts`, `__tests__/`), пороги 100/100/100/100. Пороги проверяются только с
`--coverage` (`yarn test:coverage`, `yarn verify`, CI). Любая правка холдеров — с
тестами до полного покрытия.

## Фейки

| Что подменить              | Чем                                                                           |
| -------------------------- | ----------------------------------------------------------------------------- |
| HTTP-транспорт             | `createFakeTransport`, `createTestClient` из `@shared/lib/http`               |
| текущий пользователь/права | `createFakeAccess({ userId?, permissions? })` из `@shared/lib/access/testing` |
| сокет                      | `@shared/lib/socket` (`testing/`)                                             |
| DI-контейнер               | собирается в тесте из модулей с заглушками                                    |

## Gotcha

- Методы MobX-стора нельзя `vi.spyOn` (non-configurable) — данные подставлять через
  мок API.
- Переходы в тестах навигации — `router.history.push` без `act`.
- jsdom без layout: перетаскивание, размеры и виртуализация в тестах не проверяются.
- Живая проверка экранов — [ops/live-testing](../70-ops/live-testing.md).
