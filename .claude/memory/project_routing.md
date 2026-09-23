---
name: Routing (TanStack Router)
description: Файловый роутинг, генерация routeTree, auth-guarded layout routes (_app vs _auth)
type: project
---

## Setup

- Vite plugin `@tanstack/router-plugin` (`vite.config.ts`): `routesDirectory: "./src/app/routes"`, `generatedRouteTree: "./src/app/routeTree.gen.ts"`.
- `src/app/routeTree.gen.ts` — **сгенерирован, никогда не редактировать вручную**; dev-сервер watch игнорирует его (`server.watch.ignored`) — плагин перегенерирует сам.
- `src/app/router.tsx` — `createRouter({ routeTree, defaultPendingMinMs: 300, defaultPendingMs: 100, defaultPendingComponent, defaultErrorComponent: ErrorPage })`, регистрирует `Register` для типизации `useNavigate`/`Link` по всему приложению.
- `App.tsx` рендерит `<RouterProvider router={router} />` внутри Theme/Tooltip/Notification/Modal провайдеров.

## Структура src/app/routes/

```
__root.tsx                          корневой роут — session restore
_app.tsx                            pathless layout: authenticated shell (AppLayout)
_app/
  index.tsx                         "/" → redirect на /profile
  profile.lazy.tsx                  /profile
_auth.tsx                           pathless layout: public shell (AuthLayout)
_auth/
  sign-in.lazy.tsx                  /sign-in
  sign-up.lazy.tsx                  /sign-up
  forgot-password.lazy.tsx          /forgot-password
  reset-password.tsx                non-lazy: validateSearch + beforeLoad guard (token обязателен)
  reset-password.lazy.tsx           сам компонент страницы (lazy chunk)
ui.lazy.tsx                          /ui — ui-kit-demo плейграунд
```

`_app`/`_auth` — pathless layout routes (префикс `_`, не часть URL) — TanStack Router группирует дочерние роуты под общий layout + `beforeLoad` guard.

## Auth guards

```ts
// __root.tsx — восстановление сессии один раз при старте
beforeLoad: async () => {
  const auth = IAuthStore.getInstance();
  if (auth.isIdle) await auth.restore();
};

// _app.tsx — доступ только авторизованным
beforeLoad: () => {
  const auth = IAuthStore.getInstance();
  if (!auth.isAuthenticated) throw redirect({ to: "/sign-in" });
};

// _auth.tsx — доступ только НЕ авторизованным (обратный guard)
beforeLoad: () => {
  const auth = IAuthStore.getInstance();
  if (auth.isAuthenticated) throw redirect({ to: "/" });
};
```

Guard'ы читают `IAuthStore` через `getInstance()` (вне React, синхронно из `beforeLoad`), а не `useInstance()`. `redirect({ to })` бросается как исключение — перехватывается роутером.

`reset-password.tsx` — пример роута с `validateSearch` (типизированный query-параметр `token`) и собственным `beforeLoad`, редиректящим на `/sign-in`, если токен отсутствует в URL.

## Naming

Роуты именуются TanStack Router'ом по URL-пути (`kebab-case.lazy.tsx` для lazy-loaded компонентов, без `.lazy` — для файлов с одним только `beforeLoad`/`validateSearch`, без тяжёлого UI). Это единственное место в проекте, где имя файла не свободный выбор разработчика, а требование роутера — `eslint.naming.mjs` явно исключает `app/routes/**` из общих правил именования.

## Публичный vs авторизованный периметр

Нет отдельного списка `PUBLIC_ROUTES`/`PRIVATE_ROUTES` (в отличие от RN-проекта с явным `App.screens.ts`) — принадлежность роута к периметру определяется тем, под каким pathless layout (`_app` или `_auth`) он физически лежит в файловом дереве `routes/`.
