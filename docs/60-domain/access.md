---
id: domain/access
title: Права в проекте
summary: Набор прав администрирования, каталог с сервера, гейты экранов, поведение при отзыве прав и смене сессии.
layer: project
roles: [developer, architect]
stages: [analysis, planning, implementation]
depends_on: [architecture/access]
---

# Права в проекте

Модель прав — [architecture/access](../20-architecture/access.md). Реализация:
грамматика — [shared/lib/access](../../src/shared/lib/access/README.md), стор
пользователя — [entities/user](../../src/entities/user/README.md), каталог и матрица —
[entities/permission](../../src/entities/permission/README.md).

## Набор прав

- Право — строка; `Permission`, `ALL_PERMISSIONS` (`*`) — `@shared/lib/access`
  (реэкспорт из `@entities/user`).
- Права администрирования — `ADMIN_PERMISSIONS` (`entities/user/lib/permissions.ts`):
  `user:view/update/delete/privileges`, `role:view/create/update/delete`,
  `profile:view/update/delete`, `apikey:view/create/revoke`, `audit:view`.
  Каждая кнопка — по своему праву, общих `*:manage` нет.
- Подписи и группы — только каталог сервера `GET /api/v1/permissions`; первая
  группа `*` «Система». Право `*` в карточке роли заблокировано, если текущий
  пользователь не суперпользователь.

## Экраны

- `PermissionGate` (`@entities/user`, право или список — любое): нет права (сразу или
  отозвано на открытой странице) → заглушка, `toast.warning`, `onDenied` (страницы
  передают навигацию на `/`); ошибка загрузки пользователя → `Empty` с ошибкой.
- VM страницы грузит данные и входит в комнату только с правом просмотра
  (`enabled: canView`, `useSocketRoom(type, canView ? "all" : null)`), флаги действий
  (`canCreate/canUpdate/canDelete/…`) отдаёт VM.
- Модалка закрывается при отзыве права — `useCloseWhenForbidden(open, allowed, close)`
  из `@shared/lib/hooks`.
- Модалка прав пользователя без `role:view` роли не грузит: показывает назначенные,
  чекбоксы ролей недоступны; последнюю роль снять нельзя.

## Смена прав и сессий

- После смены прав сервер отвечает 401 `AUTH_PRIVILEGES_CHANGED` на старый access —
  `bearerAuth` обновляет токен и повторяет запрос, сессия остаётся. Сокет
  `user:privileges-changed` → перечитывание пользователя.
- `session:terminated` с текущей сессией или `sessionId: "all"` (аккаунт удалён) →
  выход.
- При выходе стор пользователя и список сессий сбрасываются — следующий вход в той же
  вкладке не видит прежних прав.
- Ошибки `ROLE_SYSTEM_ROLE`, `ROLE_OWN_ROLE`, `USER_SUPERUSER_EDIT`,
  `PROFILE_SUPERUSER_EDIT` отдельно не обрабатываются — текст показывает
  `notifyApiError`.
