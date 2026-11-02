---
module: pages/profile
summary: «Мой профиль» — карточка пользователя, редактирование, аватар, приватность.
---

# profile

Страница «Мой профиль»: личные данные текущего пользователя. Маршрут `/profile`
(на него же редиректит `/`).

## Public API

| Экспорт       | Что                        |
| ------------- | -------------------------- |
| `ProfilePage` | Компонент страницы профиля |

## Устройство

- Маршрут — `src/app/routes/_app/profile.lazy.tsx`; `/` редиректит сюда
  (`src/app/routes/_app/index.tsx`).
- VM `useProfileVM`: при открытии вызывает `userStore.load()`, отдаёт модель профиля
  (`userStore.profile`), сырой `user.profile` и состояние модалки редактирования.
- Пока модели нет — `PageLoader`.
- `ProfileCard` = `ProfileIdentity` (аватар, имя, логин, роль, статус email) +
  `ProfileDetails` (сетка `InfoField`) + `ProfileMeta` (регистрация, последний визит).
  Пропсы — в отдельных `*.types.ts`.
- Компонует фичи: `ChangeAvatar` (слот аватара), `EditProfileModal`,
  `PrivacySettings`, `RequestEmailVerificationButton` (действие у поля Email, если
  email не подтверждён).

## Зависимости

- `@entities/user` — `IUserStore`, `UserAvatar`.
- `@features/change-avatar`, `@features/edit-profile`, `@features/edit-privacy`,
  `@features/request-email-verification`.
- `@shared/ui`.

## Gotcha

- `load()` вызывается один раз за открытие страницы, а не на каждый рендер (стор —
  singleton, зависимость эффекта стабильна) — покрыто тестом.
