---
module: app
summary: Композиционный корень — DI, восстановление сессии до роутера, провайдеры, файловые маршруты TanStack Router и guards периметров.
---

# app

Запуск приложения: собирает DI, восстанавливает сессию, монтирует провайдеры и
роутер. Видит все слои.

## Устройство

```
App.tsx              провайдеры Theme → Tooltip → Notification → Modal; до isRestored — PendingScreen
app.module.ts        registerContainerModules() — все <slice>.module.ts в iocContainer
app-data.store.ts    AppDataStore: restore сессии, старт/конец сессии пользователя
router.tsx           createRouter(routeTree): viewTransition, pending 100/300 мс, ErrorPage
routes/              файловые маршруты (routesDirectory)
routeTree.gen.ts     СГЕНЕРИРОВАН плагином роутера — не редактировать
styles/              глобальные стили и токены — styles/README.md
dev-performance.ts   очистка User Timing в dev (React 19 пишет каждый рендер)
view-transitions.ts  гасит отклонение ready у пропущенного View Transition
```

## AppDataStore

- `initialize()`: `auth.restore()` → `isRestored`; реакция на `isAuthenticated`.
- Вход — `userStore.load()`, инициализация сокета и `userRealtime` до выхода.
- Выход — освобождение подписок, `userStore.reset()`, `sessionStore.reset()`,
  навигация на `/sign-in`: данные прежнего пользователя не переживают выход.

## Маршруты

```
__root.tsx                   запасной restore (роутер монтируется уже после isRestored)
_app.tsx                     pathless layout: только авторизованным, AppLayout
_app/index.tsx               "/" → redirect /profile
_app/{profile,security,activity,files}.lazy.tsx
_app/admin/{users,roles,api-keys,audit}.lazy.tsx
_auth.tsx                    pathless layout: только неавторизованным, AuthLayout
_auth/{sign-in,sign-up,forgot-password}.lazy.tsx
_auth/reset-password.tsx     validateSearch + beforeLoad: без token → /sign-in
ui.lazy.tsx, ui.index.lazy.tsx, ui.$section.lazy.tsx   публичный UI Kit
```

- Периметр определяется pathless-layout (`_app` / `_auth`), списков
  публичных/приватных маршрутов нет.
- Guards в `beforeLoad` читают `IAuthStore.getInstance()` и бросают
  `redirect({ to })`.
- Имена файлов маршрутов задаёт роутер (`.lazy.tsx` — lazy-компонент, без `.lazy` —
  `beforeLoad`/`validateSearch`); `eslint.naming.mjs` исключает `app/routes/**`.
- Файл маршрута только ссылается на компонент страницы; параметры страница читает
  сама через `getRouteApi("<route id>")`. Компонент прямо в опциях
  `createLazyFileRoute` ломает `rules-of-hooks`, локальный компонент —
  `only-export-components`.

## Gotcha

- Сессия восстанавливается **до** роутера: async `beforeLoad` корня с `restore()`
  давал гонку редиректа TanStack Router (пустой экран, «Uncaught undefined» после 401
  на refresh). `ErrorBoundary` приводит брошенное не-Error значение к Error.
  Воспроизведение: `localStorage.setItem("app:refresh_token","bogus"); location.reload()`.
- Новый модуль слайса с биндингами — зарегистрировать в `app.module.ts`.
- Dev-сервер иногда не подхватывает новый `routeTree.gen.ts` — перезапуск.
