# Architecture Guide

## Feature-Sliced Design

Проект построен по методологии **[Feature-Sliced Design](https://feature-sliced.design)**. Шесть слоёв, каждый следующий строится поверх предыдущих и не знает о вышестоящих:

```
app → pages → widgets → features → entities → shared
```

```
src/
  app/                    ← композиционный корень
    App.tsx               ←   точка входа, инициализация DI + AppDataStore
    router.tsx             ←   TanStack Router instance
    routes/                 ←   файловый роутинг (routesDirectory)
    app.module.ts            ←   регистрация всех ContainerModule
    app-data.store.ts, .types.ts, app-data.module.ts
    styles/                  ←   глобальные стили, темы

  pages/                  ← экраны — тонкая композиция widgets/features/entities под роут
    sign-in/, sign-up/, forgot-password/, reset-password/
    profile/
    ui-kit-demo/
    errors/

  widgets/                ← крупные самостоятельные блоки UI
    app-layout/           ←   Header, MobileMenu, ProfileMenu, useHeaderVM
    auth-layout/

  features/               ← юзкейсы — интерактивные сценарии поверх entities
    sign-in/, sign-up/, forgot-password/, reset-password/
    edit-profile/

  entities/               ← бизнес-сущности — состояние и доменные модели, без UI-форм
    auth/                 ←   model/ (store, biometric, passkey), api/ (jwt, session, token)
    user/                  ←   model/ (store, session, realtime, ...), ui/ (UserAvatar)

  shared/                 ← переиспользуемый код без знания о бизнес-логике
    ui/                   ←   UI-кит (button, input, modal, ...)
    api/                   ←   HttpClient, orval codegen (gen/), контракты
    config/                 ←   env.ts (BASE_URL, SOCKET_BASE_URL)
    lib/                     ←   di, holders, socket, storage, theme, notifications, models, utils, ...
```

Каждый слайс (`entities/auth`, `features/sign-in`, `widgets/app-layout`, `pages/profile`, ...) — самодостаточная папка с сегментами `model/`, `api/`, `ui/`, `lib/` внутри. У `shared` слайсов нет — там сегменты (`ui/`, `api/`, `config/`, `lib/`) сами по себе плоская коллекция независимых модулей.

## Правила зависимостей

```
        ┌────────────┐
        │    app     │  видит всё
        └─────┬──────┘
              │
        ┌─────▼──────┐
        │   pages    │  shared + entities + features + widgets
        └─────┬──────┘
              │
        ┌─────▼──────┐
        │  widgets   │  shared + entities + features
        └─────┬──────┘
              │
        ┌─────▼──────┐
        │  features  │  shared + entities
        └─────┬──────┘
              │
        ┌─────▼──────┐
        │  entities  │  shared
        └─────┬──────┘
              │
        ┌─────▼──────┐
        │   shared   │  ничего бизнесового
        └────────────┘
```

Правило FSD: *модуль слайса может импортировать только слайсы строго нижних слоёв*. Импорт с того же слоя или сверху — запрещён.

### Слайсы одного слоя не видят друг друга

`entities/auth` не импортирует `entities/user`, `features/sign-in` не импортирует `features/sign-up`, `widgets/app-layout` не импортирует `widgets/auth-layout`, `pages/profile` не импортирует `pages/sign-in` — и так для каждого слоя со слайсами.

Если двум слайсам одного слоя нужна общая логика — она лежит слоем ниже. Пример: `loginValidation`/`passwordValidation` используются в `features/sign-in` и `features/sign-up`, определены в `entities/auth/model/validation.ts`.

### Разрешено

| Откуда | Куда | Пример |
|---|---|---|
| `shared` | `shared` | `shared/ui/button` → `shared/lib/utils/cn` |
| `entities` | `shared` | `entities/auth` → `@shared/lib/di` |
| `features` | `shared`, `entities` | `features/sign-in` → `@entities/auth` |
| `widgets` | `shared`, `entities`, `features` | `widgets/app-layout` → `@entities/user` |
| `pages` | `shared`, `entities`, `features`, `widgets` | `pages/profile` → `@features/edit-profile` |
| `app` | всё | `app/app.module.ts` → `@entities/auth/auth.module` |

### Запрещено

| Нарушение | Почему |
|---|---|
| **Слайс → слайс того же слоя** | `entities/auth` → `entities/user` ✗ (используй Dependency Inversion — контракт в `shared`) |
| **Слой → слой выше** | `entities/*` → `@features/*` ✗ |
| **Self-import через свой же alias** | внутри `entities/auth/model/` — `@entities/auth` ✗, только относительные пути |

Всё это проверяется `eslint-plugin-boundaries` ([eslint.boundaries.mjs](eslint.boundaries.mjs)) — 0 нарушений считается обязательным условием для мержа.

### Self-imports

Внутри слайса/сегмента — только **относительные** пути. Публичный alias самого себя — запрещён (`no-restricted-imports`, [eslint.config.mjs](eslint.config.mjs)).

```ts
// ✅ Правильно (внутри entities/auth/api/session-guard.ts)
import { IAuthStore } from "../model/types";

// ❌ Неправильно (та же папка)
import { IAuthStore } from "@entities/auth";

// ✅ Правильно (из features/sign-in в entities/auth)
import { IAuthStore } from "@entities/auth";
```

Причина: `boundaries/dependencies` разрешает импорт своего же слайса (иначе файлы внутри него не смогли бы ссылаться друг на друга), но не различает alias/относительный путь — он матчится по резолвнутому элементу, а не по тексту импорта. `no-restricted-imports` матчится по сырому спецификатору и ловит именно это.

Правило действует для всех слайсов `entities/*`, `features/*`, `widgets/*`, `pages/*` и для сегментов `shared/ui`, `shared/api`, `shared/config` (список — в `SLICE_LAYERS`/`SHARED_SEGMENTS` в [eslint.config.mjs](eslint.config.mjs)). Исключение — `shared/lib`: это не цельный модуль, а плоская россыпь независимых тем (di, models, utils, theme, socket, holders, ...), им разрешено ссылаться друг на друга через alias.

### Контракты (Dependency Inversion)

Если `shared/lib` требует данные из `entities` — создаётся контракт (интерфейс) внутри `shared`, а `entities` его реализует.

```
shared/lib/socket/transport/
  socket.transport.ts ──→ shared/lib/socket/contract/token-provider.types.ts
                               ↑
                               │ (interface, ITokenProvider)
                               │
entities/auth/api/
  token-provider.ts ──implements──→ ITokenProvider
```

## Public API (index.ts)

Правило зависит от того, есть ли у слоя слайсы.

**entities / features / widgets / pages** — Public API один на весь слайс, `index.ts` на корне слайса. Сегменты внутри (`model/`, `api/`, `ui/`) — внутренняя организация, у них нет своего `index.ts`, снаружи слайс виден только через корневой barrel:

```
entities/auth/index.ts          ← Public API слайса
entities/auth/model/store.ts    ← нет model/index.ts
entities/auth/api/token-provider.ts  ← нет api/index.ts
```

**shared** — слайсов нет, поэтому Public API определяется отдельно на каждый самостоятельный модуль/сегмент:

```
shared/ui/button/index.ts
shared/api/contract/index.ts
shared/lib/di/index.ts
shared/lib/socket/transport/index.ts
```

## Naming Conventions

Слайсы и сегменты — всегда **kebab-case**. Имя файла описывает **purpose, не essence** — слайс уже сказал, о чём он, повторять в имени файла не нужно (`entities/user/model/store.ts`, а не `User.store.ts`).

| Сущность | Паттерн | Пример |
|---|---|---|
| Слайс/сегмент (папка) | `kebab-case/` | `sign-in/`, `edit-profile/`, `model/`, `api/` |
| Компонент (`.tsx`) | `PascalCase.tsx`, совпадает с именем компонента | `SignInForm.tsx`, `UserAvatar.tsx` |
| Стор/сервис (`.ts`) | `kebab-case.ts`, без домена в имени | `store.ts`, `token-provider.ts`, `session-guard.ts` |
| Типы слайса/сегмента (единственный файл) | `types.ts` | `entities/auth/model/types.ts` |
| Типы конкретного компонента (когда их несколько в сегменте) | `<component-kebab>.types.ts`, рядом с компонентом | `profile-card.types.ts` рядом с `ProfileCard.tsx` |
| React-хук — единственный смысловой экспорт файла | имя файла = имя хука (camelCase, как экспорт) | `useSignInVM.ts`, `usePasskeyAuth.ts`, `useHeaderVM.ts` |
| React-хук — утилитарный, среди других файлов модуля | `use-kebab-case.ts` | `use-holder-ref.ts`, `use-socket-status.ts` |
| Валидация (zod) | `validation.ts` | `features/sign-in/model/validation.ts` |
| Константы сегмента | `constants.ts` | `widgets/app-layout/model/constants.ts` |
| Контракт (Dependency Inversion, интерфейс в `shared`) | `<name>.contract.ts` | `token-source.contract.ts` |
| Модуль DI-регистрации слайса | `<slice>.module.ts` | `auth.module.ts`, `user.module.ts` |
| Barrel (Public API) | `index.ts` | `index.ts` |
| Роут (TanStack Router) | `kebab-case.lazy.tsx` | `sign-in.lazy.tsx` |

Роуты в `app/routes/` именуются TanStack Router'ом по URL-пути — это единственное место, где имя файла — не свободный выбор, а требование роутера.

### Проверка автоматически (ESLint)

Часть этой таблицы (kebab-case/PascalCase файлов и папок, camelCase VM-хуков) проверяется `eslint-plugin-check-file` — см. [eslint.naming.mjs](eslint.naming.mjs). Правило покрывает `entities/*`, `features/*`, `widgets/*`, `pages/*`, `app/`, `shared/{api,config,lib,ui}`. Исключения: `app/routes/**` (именами владеет TanStack Router), `app/router.tsx` и `shared/lib/notifications/notification-service.tsx` (не компоненты, `.tsx` только из-за встроенного JSX). Соглашения, не сводящиеся к regex по пути (`purpose, не essence`, содержимое `.types.ts`), проверяются на code review.

## State Management

### Сторы (MobX)

```
entities/auth/
  model/
    store.ts        ← класс MobX store (AuthStore)
    types.ts         ← AuthStatus, IAuthStore (DI-токен)
  auth.module.ts      ← bind(IAuthStore.Tid).to(AuthStore).inSingletonScope()
```

- Стор — **только состояние и переходы**. Инфраструктура (токены, refresh) — в `api/`.
- Регистрация — явная, через `ContainerModule` в `<slice>.module.ts` (не декоратором на классе).
- Зависимости — через DI: `@IAuthTokenStorage() private _tokenStorage: IAuthTokenStorage`.

### Холдеры (async state) + React-хуки

Каждый холдер — самодостаточная папка с классом, React-хуком и опциональным Provider/Context:

```
shared/lib/holders/
  entity/             ← EntityHolder<T> + useEntity + useEntityContext + EntityProvider
  collection/         ← CollectionHolder<T> + useCollection + ...
  paged/              ← PagedHolder<T> + usePaged + ...
  infinite/           ← InfiniteHolder<T> + useInfinite + ...
  mutation/           ← MutationHolder<T> + useMutation + ...
  polling/            ← PollingHolder<T> + usePolling + ...
  base/               ← BaseHolder, BaseListHolder, CombinedHolder
  hooks/              ← shared: useHolderRef, useWatchEffect, contextHelpers
```

**React-хуки** (TanStack Query-like API):

| Хук | Holder | Аналог TQ |
|---|---|---|
| `useEntity` | `EntityHolder` | `useQuery` |
| `useCollection` | `CollectionHolder` | `useQuery` (list) |
| `usePaged` | `PagedHolder` | `useQuery` (paginated) |
| `useInfinite` | `InfiniteHolder` | `useInfiniteQuery` |
| `useMutation` | `MutationHolder` | `useMutation` |
| `usePolling` | `PollingHolder` | `useQuery` + refetchInterval |

Ключевые фичи: `queryFn`, `watch` (авто-загрузка + перезапрос при изменении), `enabled` (пропуск условия), `isBusy`.

**Provider/Context** — для шаринга состояния через дерево компонентов:

```tsx
<EntityProvider queryFn={(id) => api.getPost(id)} watch={[postId]}>
  <Child />  {/* useEntityContext() — тот же holder */}
</EntityProvider>
```

- Все холдеры возвращают `{ data } | { error }`, никогда не кидают исключения
- Поддерживают cancellation (stale responses игнорируются)
- "Quiet refresh" — данные остаются видимыми при фоновом обновлении

## DI (Dependency Injection)

- Контейнер: **Inversify**, регистрация — явная через `ContainerModule` (не auto-bind декоратором).
- Токен/фабрика: `createInjectDecorator<T>()` — возвращает объект-декоратор с `.Tid`, `.getInstance()`, `.useInstance()`.
- Каждый слайс с DI-биндингами имеет свой `<slice>.module.ts`, все модули собираются в `app/app.module.ts` (`registerContainerModules`).

```ts
// entities/auth/api/jwt-types.ts
export const IAuthJwtService = createInjectDecorator<IAuthJwtService>();
export interface IAuthJwtService {
  parse(token: string): JwtPayload | null;
}

// entities/auth/api/jwt-service.ts
@injectable()
export class AuthJwtService implements IAuthJwtService {
  parse(token: string): JwtPayload | null { ... }
}

// entities/auth/auth.module.ts
export const authModule = new ContainerModule(({ bind }) => {
  bind(IAuthJwtService.Tid).to(AuthJwtService).inSingletonScope();
});
```

Получение экземпляра:

| Где | Как |
|---|---|
| В React-компоненте/хуке | `IAuthJwtService.useInstance()` |
| Вне React (route guard, другой сервис) | `IAuthJwtService.getInstance()` |
| Инъекция в конструктор класса | `@IAuthJwtService() private _jwt: IAuthJwtService` |

Отдельных wrapper-хуков (`useAuthStore` и т.п.) нет — компоненты вызывают `IXxx.useInstance()` напрямую.

## HTTP и Авторизация

### Token lifecycle

```
AuthTokenStorage (observable) → AuthSessionService (refresh, restore) →
  HttpClient (interceptors) → API calls
  SocketTransport (via ITokenProvider)
```

### JWT

- Парсинг через `AuthJwtService.parse()` — типизированный payload, валидация структуры
- `isTokenExpiringSoon()` через `AuthJwtService`, не через голый `atob()`
- 60s buffer для preemptive refresh

### 401 handling

- **Request interceptor**: `ensureFreshToken()` → проактивный refresh при скором expiry
- **Response interceptor**: на 401 → `_handleConcurrentRefresh()` (дедуплицированный)
- При ошибке refresh → `clearTokens()` + `onSessionExpired` → `AuthStore.signOut()`
- Все запросы, получившие 401, ждут одного refresh и ретраятся

### Socket transport

- Подключение: socket.io с `reconnection: true`, `reconnectionAttempts: Infinity`
- Auth token: через `ITokenProvider` (контракт в `shared/lib/socket/contract`, реализация в `entities/auth`)
- Exponential backoff при "io server disconnect" и auth_error: 1s → 2s → 4s → 8s → 10s max
- При успешном connect: сброс счётчика retry
- `initialize()` идемпотентен

## Error Handling

- Все API-вызовы возвращают `{ data } | { error }`, исключения не кидаются
- HttpError: `isUnauthorized`, `isForbidden`, `isNotFound`, `isServerError`, `isNetworkError`
- Сетевые ошибки и 500+ показываются toast'ом (interceptor)
- 401-ошибки НЕ показываются toast'ом — они обрабатываются refresh/reconnect

## ESLint

Ключевые правила:

| Правило | Назначение |
|---|---|
| `boundaries/dependencies` | Границы слоёв/слайсов FSD ([eslint.boundaries.mjs](eslint.boundaries.mjs)) |
| `no-restricted-imports` | Self-imports внутри слайса/сегмента через свой же alias |
| `simple-import-sort/imports` | Порядок импортов (внешние → внутренние) |
| `react-refresh/only-export-components` | Fast Refresh совместимость |
| `react-hooks/rules-of-hooks` | Правила хуков |
| `react-hooks/exhaustive-deps` | Полнота зависимостей |
| `padding-line-between-statements` | Пустые строки между блоками |
