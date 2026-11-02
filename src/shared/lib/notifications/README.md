---
module: shared/lib/notifications
summary: Тосты — DI-сервис уведомлений на react-hot-toast с отрисовкой через Alert из shared/ui.
---

# notifications

Показ уведомлений (success/error/warning/info/loading, промис-тост) через
`INotificationService` вместо прямого вызова `react-hot-toast`.

## Public API

| Экспорт                                           | Что                                                                             |
| ------------------------------------------------- | ------------------------------------------------------------------------------- |
| `INotificationService`                            | DI-токен и контракт: `success/error/warning/info/loading`, `promise`, `dismiss` |
| `NotificationService`                             | реализация на `toast.custom`                                                    |
| `notificationModule`                              | `ContainerModule`: биндинг сервиса (singleton)                                  |
| `NotificationProvider`                            | рендерит детей и `<Toaster>` (top-right, `zIndex` 9999)                         |
| `NotificationToast`                               | разметка тоста: `Alert` + кнопки действий                                       |
| `NotificationOptions`, `PromiseMessages`          | опции (`id`, `title`, `duration`, `action`) и тексты для `promise`              |
| `ToastAction`, `ToastVariant`, `CustomToastProps` | типы тоста и кнопки действия                                                    |

## Устройство

- Все методы возвращают id тоста; повторный показ с тем же `id` заменяет тост.
- Длительность по умолчанию: error — 5 с, остальные — 4 с, loading — бесконечно и без
  кнопки закрытия.
- `promise` показывает loading и заменяет его успехом/ошибкой с тем же id; возвращает
  исходный промис.
- Кнопка `action` закрывает тост после клика, если не `dismiss: false`.
- `aria-live`: `assertive` для error, иначе `polite`.

## Зависимости

- `@shared/lib/di`, `@shared/ui/alert`, `@shared/ui/button`, `react-hot-toast`, `lucide-react`.
- Регистрация — `src/app/app.module.ts`; `NotificationProvider` — в `src/app/App.tsx`.
- Потребители: почти все `features/*/model` и ряд `pages`, `entities/user/ui/PermissionGate.tsx`,
  `shared/lib/http` (`notify-errors.middleware.ts`) через `shared/api/api.module.ts`.

## Gotcha

- `promise`: если `messages.success`/`messages.error` — функция и она бросила, тост
  загрузки снимается (`dismiss`), а не остаётся висеть; отказ исходного промиса
  вызывающему всё равно нужно обработать самому (`__tests__/notification-service.test.ts`).
- `notification-service.tsx` — `.tsx` из-за JSX внутри сервиса; правило именования
  файлов для него отключено eslint-комментарием.
