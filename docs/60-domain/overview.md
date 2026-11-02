---
id: domain/overview
title: Продукт и стек
summary: Что за приложение, для кого, какие разделы, с каким бэкендом работает и на каком стеке написано.
layer: project
roles: [all]
stages: [intake, analysis]
depends_on: []
---

# Продукт и стек

Веб-панель поверх бэкенда `rest-api-template-app`: личный кабинет пользователя,
файлы и администрирование доступа.

## Разделы

| Раздел             | Что делает пользователь                                           |
| ------------------ | ----------------------------------------------------------------- |
| вход и регистрация | вход по паролю, второй фактор, passkey, регистрация, сброс пароля |
| профиль            | данные профиля, аватар, приватность                               |
| безопасность       | пароль, 2FA, email, имя пользователя, passkeys, сессии, удаление  |
| мой журнал         | история своих действий                                            |
| файлы              | загрузка, список, удаление файлов                                 |
| администрирование  | пользователи и их права, роли, API-ключи, журнал аудита           |
| UI Kit (`/ui`)     | публичная документация UI-кита с примерами                        |

Маршруты и слайсы — [screens](screens.md), права — [access](access.md), живые
обновления — [realtime](realtime.md), термины — [glossary](glossary.md).

## Бэкенд

- Основной — `rest-api-template-app` (локально `http://localhost:8181`): REST API
  `/api`, Socket.IO, OpenAPI-спецификация для генерации клиента.
- Учебный — публичный `dummyjson.com` (рукописный клиент, пример второго бэкенда).
- Права, их подписи и группы — источник истины на сервере.

## Стек

TypeScript, React 19, Vite 8, MobX 6 + mobx-react-lite, Inversify 8 (DI), Axios
(транспорт) + собственный HTTP-движок, orval (генерация клиента), TanStack Router
(файловый роутинг), TanStack Table/Virtual, Tailwind CSS 4, Radix UI, Socket.IO
client 4, React Hook Form 7 + Zod 4, @simplewebauthn/browser, @dnd-kit, visx,
Vitest 4 + Testing Library. Node ≥ 22.12, Yarn 1.
