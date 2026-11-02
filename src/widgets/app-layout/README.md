---
module: widgets/app-layout
summary: Каркас авторизованной части — шапка с навигацией по правам, меню профиля, мобильное меню.
---

# app-layout

Лейаут маршрутов периметра `_app`.

## Public API

| Экспорт     | Что                                 |
| ----------- | ----------------------------------- |
| `AppLayout` | шапка + контент (`Outlet` маршрута) |

## Устройство

- `model/useHeaderVM.ts` — текущий пользователь (`IUserStore`), фильтр пунктов по
  правам, UI-состояние (`mobileOpen`).
- `model/constants.ts` — `NAV_GROUPS`, `ACCOUNT_NAV_ITEMS`: группа без label — пункты в
  ряд; с label и несколькими пунктами — выпадающее меню (`HeaderNavGroup`);
  `mobileOnly` — только в мобильном меню (в шапке эти пункты — в `ProfileMenu`).
  `NavItem.permission` — право или список (любое из).
- `ui/` — `AppLayout`, `Header`, `HeaderNavItem`, `HeaderNavGroup`, `MobileMenu`,
  `ProfileMenu` (с `ThemeMenuItem` из `features/toggle-theme`, выход —
  `features/sign-out`), `ProfileAvatar`, `AppLogo`.

## Зависимости

`@entities/user`, `@entities/auth`, `@features/toggle-theme`, `@features/sign-out`,
`@shared/ui`. С `widgets/auth-layout` не связан.

## Gotcha

- Новый раздел — пункт в `NAV_GROUPS` с правом просмотра; гейт самой страницы —
  отдельно (`PermissionGate`).
