# Architecture Guide

## Domain Modules

Проект построен по принципу **Domain Modules** — каждый домен (auth, user, chat, calls) представляет собой самодостаточный модуль со своей инфраструктурой, состоянием и UI.

```
src/
  auth/          ← домен аутентификации
    services/    ←   инфраструктура (токены, refresh, API)
    store/       ←   состояние (MobX store)
    pages/       ←   UI (страницы и компоненты)
  user/          ← домен пользователя
    services/
    store/
    pages/
  chat/          ← следующий домен (когда появится)
    ...

  lib/           ← generic-инфраструктура (storage, notification, socket, env)
  api/           ← HTTP client + codegen (orval)
  store/         ← shared стор (AppDataStore, holders)
  components/    ← shared UI kit (button, input, modal, layouts)
  models/        ← shared view-models (DataModelBase, DateModel)
  di/            ← DI-контейнер (Inversify)
  utils/         ← pure utility functions
```

## Правила зависимостей

```
        ┌─────────────┐
        │    api/     │ ← HTTP, codegen
        └──────┬──────┘
               │
        ┌──────▼──────┐
        │   lib/      │ ← generic infrastructure
        └──────┬──────┘
               │
        ┌──────▼──────────┐     ┌─────────────┐
        │   auth/         │────→│  auth/store  │
        │   user/  ↑      │     └──────┬───────┘
        │   chat/  │      │            │
        └──────────┴───────┘    ┌──────▼───────┐
                                │  auth/pages  │
                                └──────────────┘
```

### Разрешено

| Откуда | Куда | Пример |
|---|---|---|
| **Домен** | `lib/` | `auth/` → `@lib/storage` |
| **Домен** | `api/` | `user/` → `@api` |
| **Домен** | `di/` | `auth/` → `@di` |
| **Домен** | `models/` | `auth/` → `@models` |
| **store/ (shared)** | **любой домен** | `store/app/` → `@auth/store` |
| **components/** | `lib/`, `api/`, **любой домен** | `components/` → `@auth/store` |

### Запрещено

| Нарушение | Почему |
|---|---|
| **Домен → Домен напрямую** | `auth/` → `chat/` ✗ |
| **lib/ → Домен** | `lib/socket/` → `auth/` ✗ |
| **Self-import через алиас** | `auth/store/` → `@auth/services` ✗ |

### Self-imports

Внутри модуля — только **относительные** пути. Алиасы — только для кросс-модульных импортов.

```ts
// ✅ Правильно (внутри auth/)
import { IAuthApiService } from "../services";

// ❌ Неправильно (внутри auth/)
import { IAuthApiService } from "@auth/services";

// ✅ Правильно (из user/ в auth/)
import { IAuthStore } from "@auth/store";
```

Настроено в ESLint: `no-restricted-imports` с `files: ["src/auth/**"]` и т.д.

### Контракты (Dependency Inversion)

Если `lib/` требует данные от домена — создаётся контракт (интерфейс) внутри `lib/`.

```
lib/socket/transport/
  Socket.transport.ts ──→ lib/socket/contract/TokenProvider.types.ts
                               ↑
                               │ (interface)
                               │
auth/services/
  AuthTokenProvider.service.ts ──implements──→ lib/socket/contract/TokenProvider.types.ts
```

## Naming Conventions

| Сущность | Папка | Файл | Пример |
|---|---|---|---|
| **Роут** (TanStack Router) | — | `kebab-case.lazy.tsx` | `sign-in.lazy.tsx` |
| **Компонент** | `PascalCase/` или `kebab-case/` | `PascalCase.tsx` | `TwoFactorPrompt.tsx` |
| **Группа компонентов** | `kebab-case/` | — | `passkey-login/` |
| **Хук** | `hooks/` | `camelCase.ts` | `useSignInVM.ts` |
| **Сервис** | `services/` | `PascalCase.service.ts` | `AuthJwt.service.ts` |
| **Стор** | `store/` | `PascalCase.store.ts` | `Auth.store.ts` |
| **Типы** | — | `PascalCase.types.ts` | `Auth.types.ts` |
| **Модель** | `models/` | `PascalCase.model.ts` | `User.model.ts` |
| **Barrel** | — | `index.ts` | `index.ts` |
| **Валидация** (zod) | — | `validations.ts` | `validations.ts` |

Роуты именуются TanStack Router'ом по URL-пути — это единственное место с kebab-case в именах файлов.

Вспомогательные папки для grouping — `kebab-case`: `passkey-login/`, `two-factor-prompt/`.

Файлы внутри них — `PascalCase` (компоненты) или `camelCase` (хуки).

## State Management

### Сторы (MobX)

```
domain/store/
  X.store.ts        ← класс MobX store
  X.types.ts        ← AuthStatus, IAuthStore (interface + DI decorator)
  hooks/
    useXStore.ts    ← iocHook(IX)
```

- Стор — **только состояние и переходы**. Бизнес-логика — в сервисах.
- Сторы регистрируются в DI через декоратор: `@IAuthStore({ inSingleton: true })`
- Сторы получают зависимости через DI: `@IAuthApiService() private _authApi`

### Холдеры (async state)

```
store/holders/
  EntityHolder<T>     ← одна сущность (load, refresh, setData)
  CollectionHolder<T> ← список без пагинации
  PagedHolder<T>      ← серверная пагинация
  InfiniteHolder<T>   ← infinite scroll
  MutationHolder<T>   ← одноразовые мутации
```

- Все холдеры возвращают `{ data } | { error }`, никогда не кидают исключения
- Поддерживают cancellation (stale responses игнорируются)
- "Quiet refresh" — данные остаются видимыми при фоновом обновлении

## DI (Dependency Injection)

- Контейнер: **Inversify**
- Декораторы: `createServiceDecorator<T>()`
- Регистрация: `@IAuthService({ inSingleton: true }) class AuthService ...`
- Получение: `IAuthService.getInstance()` (для route guards)
- Инъекция: `@IAuthService() private _service`

```ts
// Типы и декоратор — в одном файле
export const IAuthJwtService = createServiceDecorator<IAuthJwtService>();
export interface IAuthJwtService {
  parse(token: string): JwtPayload | null;
}

// Реализация
@IAuthJwtService({ inSingleton: true })
export class AuthJwtService implements IAuthJwtService {
  parse(token: string): JwtPayload | null { ... }
}
```

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
- Auth token: через `ITokenProvider` (контракт, не прямая зависимость)
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
| `simple-import-sort/imports` | Порядок импортов (внешние → внутренние) |
| `react-refresh/only-export-components` | Fast Refresh совместимость |
| `react-hooks/rules-of-hooks` | Правила хуков |
| `react-hooks/exhaustive-deps` | Полнота зависимостей |
| `no-restricted-imports` | Self-imports внутри модуля |
| `padding-line-between-statements` | Пустые строки между блоками |
