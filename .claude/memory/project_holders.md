---
name: MobX Holders
description: TanStack-Query-like async-state слой поверх MobX — EntityHolder/CollectionHolder/PagedHolder/InfiniteHolder/MutationHolder/PollingHolder/CombinedHolder + хуки
type: project
---

## Расположение

```
shared/lib/holders/
  base/       BaseHolder, BaseListHolder, CombinedHolder
  entity/     EntityHolder<T> + useEntity + use-entity-context + EntityProvider
  collection/ CollectionHolder<T> + useCollection + use-collection-context + CollectionProvider
  paged/      PagedHolder<T> + usePaged + ...
  infinite/   InfiniteHolder<T> + useInfinite + ...
  mutation/   MutationHolder<TArgs, TData> + useMutation + ...
  polling/    PollingHolder<T> + usePolling + ...
  cursor/     CursorHolder, CachedCursorHolder, SyncCursorHolder (курсорная пагинация)
  filter/     FilterHolder, FiltersHolder, ValueHolder (state фильтров/поиска)
  hooks/      useHolderRef, useWatchEffect, contextHelpers — общая инфраструктура
```

Каждый холдер — самодостаточная папка: класс + React-хук + опциональные `*Provider.tsx`/`use-*-context.ts`.

## Хуки (TanStack Query-like API)

| Хук             | Холдер             | Аналог TanStack Query          |
| --------------- | ------------------ | ------------------------------ |
| `useEntity`     | `EntityHolder`     | `useQuery`                     |
| `useCollection` | `CollectionHolder` | `useQuery` (list)              |
| `usePaged`      | `PagedHolder`      | `useQuery` (paginated)         |
| `useInfinite`   | `InfiniteHolder`   | `useInfiniteQuery`             |
| `useMutation`   | `MutationHolder`   | `useMutation`                  |
| `usePolling`    | `PollingHolder`    | `useQuery` + `refetchInterval` |

Ключевые опции хуков: `queryFn`/`onFetch`, `watch` (массив зависимостей — авто-загрузка + перезапрос при изменении), `enabled` (пропуск авто-загрузки), `initialData`.

```tsx
// пример: useEntity
const { data, isLoading, isBusy, error, load, refresh } = useEntity<
  PostDto,
  string
>({
  queryFn: id => api.getPost(id),
  watch: [postId],
  enabled: !!postId,
});
```

### Provider/Context — шаринг холдера через дерево компонентов

```tsx
<EntityProvider queryFn={id => api.getPost(id)} watch={[postId]}>
  <Child /> {/* useEntityContext() возвращает тот же holder-инстанс */}
</EntityProvider>
```

## Base classes (shared/lib/holders/base/)

- `BaseHolder<TError>` — общий `status` (`HolderStatus`: Idle/Loading/Refreshing/Success/Error) + `error`; computed-геттеры `isIdle/isLoading/isRefreshing/isBusy/isSuccess/isError`; `setLoading()/setRefreshing()/setError()`. `EntityHolder`, `PagedHolder`, `InfiniteHolder`, `CollectionHolder` (через `BaseListHolder`) наследуют его.
- `BaseListHolder<TItem, TError>` — расширяет `BaseHolder` с `items: TItem[]`, key-extractor-based операциями (`removeItem` принимает predicate ИЛИ key).
- `CombinedHolder` — не наследует `BaseHolder`, принимает массив `IHolderLike` (structural typing, любой холдер подходит) и агрегирует `isLoading`/`isBusy` (`some`), `isSuccess` (`every`), `errors`/`firstError`. Используется, когда UI зависит от нескольких независимых холдеров сразу (например: страница ждёт и `userHolder`, и `settingsHolder`).

## EntityHolder<TData, TArgs, TError>

Одиночная сущность. `data: TData | null`, `isEmpty` (success + null), `isFilled` (`data !== null`), `isReady` (`isSuccess || isError`). Методы: `load(args?)`, `refresh(args?)` (форсирует `Refreshing` вместо `Loading` — не сбрасывает видимые данные, "quiet refresh"), `fromApi(fn, { refresh? })` — ручной вызов произвольного API-метода с тем же lifecycle, `setData(data)` (мгновенная запись, например seed из login-ответа), `reset()`. Отменяет предыдущий pending fetch при повторном вызове (`_pendingFetch?.cancel?.()`), stale-ответы игнорируются (`isCancelResponse`/`isCancelError`).

Пример из кода — `entities/user/model/store.ts`:

```ts
private _holder = new EntityHolder<UserDto>({ onFetch: () => this._api.getMyUser() });
// ...
load() {
  return this._holder.isFilled ? this._holder.refresh() : this._holder.load();
}
```

## CollectionHolder<TItem, TArgs, TError>

Список сущностей, тот же lifecycle что `EntityHolder`, плюс: `setItems`, `prependItem`, `appendItem`, `removeItem(predicate | key)`, `appendIfNotExists(key, item)`, конструктор принимает `keyExtractor` для key-based операций. `fromApi(fn, extractor?, options?)` — `extractor` достаёт массив из произвольной формы ответа (не обязательно `TItem[]` напрямую).

## MutationHolder<TArgs, TData, TError>

Не наследует `BaseHolder` (свой, более простой `MutationStatus`: Idle/Loading/Success/Error, без Refreshing). `execute(args, fn?)` — `fn` берётся из аргумента или из `onMutate` в конструкторе. `run(fn)` — вызов без сохранённого `onMutate`, для одноразовых мутаций. Пример — `entities/user/model/session-store.ts`: `terminateMutation = new MutationHolder<string, void>()`, `terminateMutation.execute(sessionId, async id => {...})`.

## PagedHolder / InfiniteHolder / PollingHolder

- `PagedHolder` — офсетная/номерная пагинация, аналог `useQuery` с page-параметром.
- `InfiniteHolder` — бесконечная подгрузка (аналог `useInfiniteQuery`), склеивает страницы.
- `PollingHolder` — периодический re-fetch (`usePolling` ~ `refetchInterval`).
- `CursorHolder`/`CachedCursorHolder`/`SyncCursorHolder` (`holders/cursor/`) — курсорная пагинация с опциональным кэшем страниц.
- `FilterHolder`/`FiltersHolder`/`ValueHolder` (`holders/filter/`) — управление состоянием фильтров/значений формы поиска, обычно комбинируется с `Paged`/`Infinite` холдером через `watch`.

## Общие гарантии

- Все холдеры возвращают `{ data } | { error }` — исключения наружу не пробрасываются.
- Cancellation: повторный вызов отменяет предыдущий in-flight запрос, "stale" ответы игнорируются даже если промис резолвится позже.
- "Quiet refresh": `refresh()`/`options.refresh` переводит статус в `Refreshing`, а не `Loading` — предыдущие данные остаются видимыми, пока фонит новый запрос.

## Тесты — 100% coverage обязателен

`shared/lib/holders` — единственная зона с coverage-порогом 100/100/100/100 (`vitest.config.ts`), тесты в `holders/__tests__/`. Любая правка холдеров без тестов роняет `yarn test:coverage`. См. `project_testing.md`.

## Инфраструктура хуков (holders/hooks/)

- `useHolderRef(factory)` — создаёт холдер один раз (`useRef`) и переживает ре-рендеры, не пересоздавая инстанс.
- `useWatchEffect(loadFn, { watch, enabled })` — авто-вызывает `load`/`refresh` при изменении `watch`-зависимостей, пропускает если `enabled === false`.
- `contextHelpers` — общая фабрика для `use-*-context.ts` файлов (создание `Context` + типизированный `useXxxContext()` с ошибкой при отсутствии Provider).
