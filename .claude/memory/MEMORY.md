# Memory Index

## Архитектура и структура

- [Architecture](project_architecture.md) — FSD-дерево src/, стек, DI, layer-boundary правила
- [Path aliases](project_aliases.md) — @app, @pages, @widgets, @features, @entities, @shared
- [Build & Environment](project_build.md) — команды, git hooks, Docker, CI

## API и сессия

- [API](project_api.md) — HTTP-движок lib/http, middleware, ошибки, отмена, несколько бэкендов
- [Session](project_session.md) — токены, refresh, политики, связь с HTTP и сокетом

## Домен

- [Auth](project_auth.md) — token lifecycle, session, JWT, socket auth, 2FA, passkey (feature-level) / biometric (entities/biometric)
- [Holders](project_holders.md) — MobX holder-система (EntityHolder/PagedHolder/...) и хуки (useEntity, useCollection, ...)

## UI и роутинг

- [UI](project_ui.md) — shared/ui-инвентарь, Tailwind 4, @source gotcha, widgets (app-layout, auth-layout)
- [Routing](project_routing.md) — TanStack Router, файловые роуты, auth guards

## Качество

- [Testing](project_testing.md) — Vitest + Testing Library, **tests** рядом с кодом, 100% coverage порог на holders
- [Patterns](project_patterns.md) — создание entity-стора, feature (VM + validation), page, widget
