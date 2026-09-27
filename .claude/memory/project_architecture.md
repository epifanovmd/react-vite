---
name: Project Architecture
description: React + Vite messenger/admin panel — FSD-структура, стек, DI, layer-boundary правила
type: project
---

## Project Structure

Feature-Sliced Design: `app → pages → widgets → features → entities → shared`.

```
src/
├── app/                     # композиционный корень
│   ├── App.tsx              # DI init (registerContainerModules) + AppDataStore.initialize()
│   ├── router.tsx           # TanStack Router instance (createRouter)
│   ├── routes/              # файловый роутинг (routesDirectory: ./src/app/routes)
│   ├── routeTree.gen.ts     # СГЕНЕРИРОВАН @tanstack/router-plugin — не редактировать вручную
│   ├── app.module.ts        # registerContainerModules() — грузит все ContainerModule в iocContainer
│   ├── app-data.store.ts, app-data.types.ts, app-data.module.ts
│   └── styles/              # index.css (Tailwind entry), light/dark theme, normalize
├── pages/                   # экраны — тонкая композиция widgets/features/entities под роут
│   ├── sign-in/, sign-up/, forgot-password/, reset-password/
│   ├── profile/             # model/ + ui/
│   ├── ui-kit-demo/         # плейграунд UI-кита (kanban, table examples)
│   └── errors/              # ErrorPage, NotFoundPage
├── widgets/                 # крупные самостоятельные блоки UI
│   ├── app-layout/          # AppLayout, Header, MobileMenu, ProfileMenu, model/useHeaderVM
│   └── auth-layout/         # AuthLayout
├── features/                # юзкейсы поверх entities
│   ├── sign-in/             # model/useSignInVM, usePasskeyAuth, validation; ui/SignInForm, PasskeyLogin, TwoFactorPrompt
│   ├── sign-up/, forgot-password/, reset-password/, edit-profile/
│   └── request-email-verification/, sign-out/
├── entities/                # бизнес-сущности — состояние и модели, БЕЗ UI-форм
│   ├── auth/
│   │   ├── model/           # store.ts (AuthStore), types.ts, validation.ts
│   │   ├── api/              # session-guard.ts (токены — shared/lib/session + shared/api/main)
│   │   ├── auth.module.ts
│   │   └── index.ts          # Public API: authModule, AuthStatus, IAuthStore, loginValidation, passwordValidation
│   └── user/
│       ├── model/            # store.ts (UserStore), session-store.ts (+ session-model.ts, session-types.ts), realtime.ts, user-model.ts, profile-model.ts, role-model.ts, public-user-model.ts
│       ├── api/               # user-socket.ts (UserSocketService — реалтайм-события пользователя)
│       ├── lib/permissions.ts
│       ├── ui/UserAvatar.tsx
│       └── user.module.ts
└── shared/                  # переиспользуемый код без знания о бизнес-логике
    ├── ui/                  # UI-кит: button, input, select, table, date-picker, kanban, modal, drawer,
    │                        #   form, tabs, tooltip, badge, avatar, card, checkbox, chips, collapse, confirm,
    │                        #   copyable, empty, error-boundary, icon-button, info-field, loaders, masked-input,
    │                        #   page-header, page-layout, pagination, popover, radio, segmented, separator,
    │                        #   spinner, stat-card, switch, textarea, theme-toggle, foundation/ripple
    ├── api/                 # HttpClient (api.ts), ApiError, contract/, gen/ (orval, не редактировать)
    ├── config/              # env.ts (BASE_URL, SOCKET_BASE_URL)
    └── lib/                 # di, holders, socket, storage, theme, notifications, network, app-state,
                              #   media, webrtc, slots, models, utils, hooks, contracts
```

Слайсы одного слоя не импортируют друг друга напрямую (`entities/auth` не видит `entities/user`, `features/sign-in` не видит `features/sign-up` и т.д.) — проверяется `eslint-plugin-boundaries` (`eslint.boundaries.mjs`). Именование файлов/папок — `eslint-plugin-check-file` (`eslint.naming.mjs`). Полная таблица разрешённых/запрещённых импортов и naming-конвенций — в корневом `ARCHITECTURE.md`.

## Stack

TypeScript, React 19, Vite 8, MobX 6 + mobx-react-lite, Inversify 8 (DI), Axios + orval (API codegen), TanStack Router 1.x (файловый роутинг), TanStack Table 8, Tailwind CSS 4, Socket.IO client 4, React Hook Form 7 + Zod 4, @simplewebauthn/browser (passkeys), Radix UI primitives, @dnd-kit, Vitest 4 + Testing Library (jsdom) — см. `project_testing.md`.

Node >= 22.12.0, Yarn >= 1.22.18.

## Path Aliases

`@app`, `@pages`, `@widgets`, `@features`, `@entities`, `@shared` — объявлены в `vite.config.ts` (`resolve.alias`) и `tsconfig.json` (`paths`), синхронизируются вручную. Подробнее — `project_aliases.md`.

## IoC (src/shared/lib/di/)

Inversify, явная регистрация через `ContainerModule` (без auto-bind декораторов):

```ts
export const IMyService = createInjectDecorator<IMyService>();
@injectable()
class MyService implements IMyService {
  constructor(@IOther() private other: IOther) {}
}
// в <slice>.module.ts:
bind(IMyService.Tid).to(MyService).inSingletonScope();
// использование:
const service = IMyService.useInstance(); // в React
const service = IMyService.getInstance(); // вне React (route guard, сервис)
```

Все `<slice>.module.ts` собираются в `src/app/app.module.ts` (`registerContainerModules`). Обёрточных хуков (`useAuthStore` и т.п.) нет — компоненты вызывают `IXxx.useInstance()` напрямую.

## Routing (TanStack Router)

`src/app/router.tsx` создаёт `router` из сгенерированного `routeTree.gen.ts`. Роуты — файлы в `src/app/routes/`. Подробнее — `project_routing.md`.

## State Management (MobX)

Singleton MobX-сторы через DI + холдеры (`shared/lib/holders/`) для асинхронного состояния: `EntityHolder`, `PagedHolder`, `InfiniteHolder`, `CollectionHolder`, `MutationHolder`, `PollingHolder`, `CombinedHolder`. Подробнее — `project_holders.md`.

## API Layer

HTTP-движок — `shared/lib/http` (пайплайн middleware поверх транспорта, см. `project_api.md`), токены — `shared/lib/session` (см. `project_session.md`). В `shared/api` лежат только конкретные бэкенды: `main/` и `dummyjson/`, плюс `gen/<name>/` от orval (`yarn generate:orval`), редактировать вручную нельзя.

## Socket.IO

`shared/lib/socket/transport/socket.transport.ts` — auto-reconnect (exponential backoff 1s→2s→4s→8s→10s max при "io server disconnect"/auth_error), `reconnection: true`, `reconnectionAttempts: Infinity`. Auth token — через `ITokenProvider` (контракт в `shared/lib/socket/contract/`, реализация — `AuthTokenProvider` в `entities/auth`). Сегменты: `contract/`, `events/`, `hooks/` (useSocketStatus), `transport/`, `socket.module.ts`. Доменный `UserSocketService` живёт в `entities/user/api/user-socket.ts` (папка `shared/lib/socket/user/` пуста — leftover после переноса).

## Auth / User split

`IAuthStore` (`entities/auth`) — только аутентификация и сессия (status, 2FA, sign-in/up/out). `IUserStore` (`entities/user`) — доменные данные текущего пользователя (профиль, роли, permissions). Подробнее — `project_auth.md`.
