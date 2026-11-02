---
module: shared/lib/holders
summary: Асинхронное состояние поверх MobX в стиле TanStack Query — холдеры сущности, списков, пагинации, мутаций, опроса и их хуки.
---

# holders

Единый механизм асинхронного состояния
([architecture/state](../../../../docs/20-architecture/state.md)). Ручной
`useState` + `useEffect`-загрузки в проекте нет — только холдеры.

## Public API

| Хук             | Холдер             | Аналог TanStack Query          |
| --------------- | ------------------ | ------------------------------ |
| `useEntity`     | `EntityHolder`     | `useQuery`                     |
| `useCollection` | `CollectionHolder` | `useQuery` (список)            |
| `usePaged`      | `PagedHolder`      | `useQuery` (страницы)          |
| `useInfinite`   | `InfiniteHolder`   | `useInfiniteQuery`             |
| `useMutation`   | `MutationHolder`   | `useMutation`                  |
| `usePolling`    | `PollingHolder`    | `useQuery` + `refetchInterval` |

Также: `CombinedHolder`, курсорные `CursorHolder`/`CachedCursorHolder`/`SyncCursorHolder`,
фильтры `FilterHolder`/`FiltersHolder`/`ValueHolder`, Provider/Context на каждый
холдер (`EntityProvider` + `useEntityContext` и т. д.), типы `holder.types.ts`.

## Устройство

```
base/        BaseHolder, BaseListHolder, CombinedHolder
entity/ collection/ paged/ infinite/ mutation/ polling/   класс + хук + Provider/context
cursor/      курсорная пагинация с опциональным кэшем страниц
filter/      состояние фильтров и поиска (комбинируется через watch)
hooks/       useHolderRef, useLatestFn, useWatchEffect, contextHelpers
```

- Опции хуков: `queryFn`/`onFetch`, `watch` (зависимости: автозагрузка и перезапрос),
  `autoLoad` (загрузка при монтировании для холдера без аргументов; при
  `TArgs = void` тип `watch` — `never`), `enabled`, `initialData`.
- `BaseHolder` — `status` (Idle/Loading/Refreshing/Success/Error), `error`,
  `isIdle/isLoading/isRefreshing/isBusy/isSuccess/isError`.
- `EntityHolder`: `data`, `isEmpty`, `isFilled`, `isReady`; `load`, `refresh` (тихая
  перезагрузка — статус `Refreshing`, данные видны), `fromApi(fn, { refresh? })`,
  `setData`, `reset`.
- `CollectionHolder`: `setItems`, `prependItem`, `appendItem`,
  `removeItem(predicate | key)`, `appendIfNotExists`; `keyExtractor` в конструкторе;
  `fromApi(fn, extractor?, options?)`.
- `MutationHolder` не наследует `BaseHolder`: свой статус без Refreshing;
  `execute(args, fn?)`, `run(fn)` для одноразовых.
- `CombinedHolder` агрегирует любые холдеры (structural typing): `isLoading`/`isBusy`
  — some, `isSuccess` — every, `errors`/`firstError`.
- `useLatestFn` — хук вызывает функцию последнего рендера: `queryFn`/`mutationFn`,
  читающие пропсы, не залипают на первом рендере. Перезапрос — только по `watch`.
- Повторный вызов отменяет предыдущий запрос; устаревшие и отменённые
  (`error.isCanceled`) ответы игнорируются.

```tsx
const { data, isLoading, error } = useEntity<PostDto, string>({
  queryFn: id => api.getPost(id),
  watch: [postId],
  enabled: !!postId,
});
```

## Зависимости

MobX; тип ошибки отмены — от `@shared/lib/http`. Используется всеми слоями выше.

## Gotcha

- Порог покрытия **100%** по всем метрикам (`vitest.config.ts`): правка без тестов
  роняет `yarn test:coverage`. Тесты — `__tests__/` каждой папки.
- Без `watch` и без `autoLoad` холдер не грузит сам — список молча пустой, нужен
  `load()`.
- Списки (`items`, `pendingItems` у `SyncCursorHolder`) — `observable.ref`: любая
  запись — замена массива (`[...a, x]`, `map`, `filter`); `push/splice/sort` и мутации
  полей элементов не вызывают реакций. Тест — `base/__tests__/list-holder-observability.test.ts`.
- Cast в `fromApi` скрывает ошибку типа от tsc — передавать extractor
  (`page => page.items`).
- Стратегии `shared/ui/select` — задокументированное исключение: работают вне
  `observer`, на своём `useOptionsRequest`.
