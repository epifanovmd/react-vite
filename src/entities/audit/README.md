---
module: entities/audit
summary: Журнал аудита — курсорная лента событий, подписи типов и таблица событий.
---

# audit

Сущность «событие журнала аудита»: модель ленты с подгрузкой по курсору, справочник
подписей типов и таблица. Используется «Моим журналом» и общим журналом админки.

## Public API

| Экспорт             | Что                                                                                            |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| `AuditFeed`         | MobX-модель ленты: `load`, `loadMore`, `prepend`, `items`, `hasMore`, `error`, `loadMoreError` |
| `AuditPageFetcher`  | Тип загрузчика страницы `(cursor, limit) => IApiResponse<…>`                                   |
| `useAuditFeed`      | Хук: `AuditFeed` на время жизни компонента, перезагрузка при смене `deps`                      |
| `AuditEventTable`   | Таблица событий с кнопкой «Показать ещё»; `actorName` включает колонку автора                  |
| `AUDIT_EVENT_TYPES` | Известные клиенту типы событий — для фильтров                                                  |
| `auditEventMeta`    | Подпись и оттенок `Badge` по типу события                                                      |

## Устройство

- `model/audit-feed.ts` — `AuditFeed` поверх `CursorHolder` (`@shared/lib/holders`):
  первая страница — без курсора, следующие — по `nextCursor` из ответа; размер
  страницы `AUDIT_PAGE_SIZE` = 30.
- `model/use-audit-feed.ts` — экземпляр через `useHolderRef`, загрузчик через
  `useEvent` (всегда актуальное замыкание), `load()` в эффекте по `deps`.
- `lib/audit-event.ts` — словарь `тип → { label, tone }`.
- Сокет и источник данных (свой / общий журнал) задаёт page.

## Зависимости

- `@shared/lib/holders` — `CursorHolder`, `useHolderRef`, `isCancelResponse`.
- `@shared/lib/hooks` (`useEvent`), `@shared/lib/utils` (`formatter`,
  `describeUserAgent`), `@shared/ui`, `@shared/api/gen` (типы).
- Используют: `pages/activity`, `pages/admin-audit`.

## Gotcha

- Счётчик поколений `_generation`: ответы прежних `load` / `loadMore` после нового
  `load` (например, смена фильтра) не применяются; `loadMore` не уходит, пока идёт
  `load`. Сценарии гонок покрыты тестами.
- `prepend` не дублирует событие с тем же id — одно событие может прийти и адресно,
  и из комнаты `audit`.
- Неизвестный тип события показывается как есть, с оттенком `outline`.
- `error` — только ошибка первой страницы (таблица показывает заглушку вместо строк);
  ошибка «Показать ещё» — отдельно в `loadMoreError`, выводится у кнопки и не
  скрывает загруженные события. Повтор — той же кнопкой. При перезагрузке ленты и
  ошибке первой страницы `loadMoreError` — `null`: прежняя ошибка подгрузки не висит.
