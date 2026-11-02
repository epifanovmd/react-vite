---
module: features/sign-up
summary: Регистрация нового аккаунта по email или телефону.
---

# sign-up

Карточка регистрации: имя, фамилия, логин (email или телефон), пароль и его повтор.

## Public API

| Экспорт      | Что                                               |
| ------------ | ------------------------------------------------- |
| `SignUpForm` | observer-карточка; пропсы `onSuccess`, `onSignIn` |

## Устройство

- `model/useSignUpVM.ts` (`onSuccess`) — `handleSignUp` определяет тип логина (`isEmail`/`isPhone`) и вызывает `IAuthStore.signUp` с `email` или `phone`; `onSuccess()` — только если стор стал `isAuthenticated`.
- Ошибка регистрации хранится в `IAuthStore.error` и выводится `Alert`; индикатор кнопки — `IAuthStore.isLoading`.
- `model/validation.ts` — `loginValidation`, `passwordValidation` из `@entities/auth`; совпадение паролей — `refineFormField` на `confirmPassword`. У поля пароля `rules={{ deps: "confirmPassword" }}`.

## Зависимости

- `@entities/auth` (`IAuthStore`, валидации).
- `@shared/lib/utils` (`isEmail`, `isPhone`), `@shared/lib/validation`, `@shared/ui`.
- Используется: `pages/sign-up`.

## Gotcha

- Поле логина имеет `type="email"`, хотя принимает и телефон; нативная валидация браузера отключена (`Form` с `noValidate`), так что ввод телефона не блокируется.
- `confirmPassword` валидируется той же `passwordValidation` (минимум 6 символов), а не только на совпадение.
