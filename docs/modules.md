<!-- Сгенерировано scripts/docs/check.mjs (yarn docs:index). Не редактировать вручную. -->

# Модули

Документация модулей лежит рядом с кодом: `src/<модуль>/README.md`. Шаблон —
[module-readme](00-meta/templates/module-readme.md).

## app

| Модуль                                    | О чём                                                                                                                            |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| [app](../src/app/README.md)               | Композиционный корень — DI, восстановление сессии до роутера, провайдеры, файловые маршруты TanStack Router и guards периметров. |
| [app/styles](../src/app/styles/README.md) | Глобальные стили — вход Tailwind 4 (CSS-first), темы, токены, утилиты движения и их gotcha.                                      |

## pages

| Модуль                                                          | О чём                                                                                                |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [pages/activity](../src/pages/activity/README.md)               | «Мой журнал» — лента событий безопасности текущего пользователя.                                     |
| [pages/admin-api-keys](../src/pages/admin-api-keys/README.md)   | Админка API-ключей — список с пагинацией, создание и отзыв.                                          |
| [pages/admin-audit](../src/pages/admin-audit/README.md)         | Общий журнал аудита всех пользователей с фильтрами по типу и автору.                                 |
| [pages/admin-roles](../src/pages/admin-roles/README.md)         | Админка ролей — создание, матрица прав каждой роли, удаление.                                        |
| [pages/admin-users](../src/pages/admin-users/README.md)         | Админка пользователей — поиск, пагинация, правка прав и удаление.                                    |
| [pages/errors](../src/pages/errors/README.md)                   | Страницы ошибки роутера и 404.                                                                       |
| [pages/files](../src/pages/files/README.md)                     | «Мои файлы» — загрузка, список с пагинацией и статусом обработки, удаление.                          |
| [pages/forgot-password](../src/pages/forgot-password/README.md) | Страница запроса сброса пароля.                                                                      |
| [pages/profile](../src/pages/profile/README.md)                 | «Мой профиль» — карточка пользователя, редактирование, аватар, приватность.                          |
| [pages/reset-password](../src/pages/reset-password/README.md)   | Страница установки нового пароля по токену из письма.                                                |
| [pages/security](../src/pages/security/README.md)               | «Безопасность» — пароль, email, username, 2FA, passkeys, сессии, удаление аккаунта.                  |
| [pages/sign-in](../src/pages/sign-in/README.md)                 | Страница входа.                                                                                      |
| [pages/sign-up](../src/pages/sign-up/README.md)                 | Страница регистрации.                                                                                |
| [pages/ui-kit-demo](../src/pages/ui-kit-demo/README.md)         | Публичная документация UI-кита на /ui — сайдбар с поиском и группами, страницы разделов с примерами. |

## widgets

| Модуль                                                      | О чём                                                                                     |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| [widgets/app-layout](../src/widgets/app-layout/README.md)   | Каркас авторизованной части — шапка с навигацией по правам, меню профиля, мобильное меню. |
| [widgets/auth-layout](../src/widgets/auth-layout/README.md) | Лейаут экранов авторизации — центрированная колонка с логотипом и названием приложения.   |

## features

| Модуль                                                                                      | О чём                                                                              |
| ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [features/change-avatar](../src/features/change-avatar/README.md)                           | Загрузка нового аватара профиля и его удаление.                                    |
| [features/change-email](../src/features/change-email/README.md)                             | Смена email пользователя в два шага — новый адрес, затем код из письма.            |
| [features/change-password](../src/features/change-password/README.md)                       | Смена пароля текущего пользователя по старому паролю.                              |
| [features/create-api-key](../src/features/create-api-key/README.md)                         | Создание API-ключа с однократным показом секрета.                                  |
| [features/delete-account](../src/features/delete-account/README.md)                         | Удаление собственного аккаунта с подтверждением паролем.                           |
| [features/delete-file](../src/features/delete-file/README.md)                               | Удаление своего файла с диалогом подтверждения.                                    |
| [features/delete-user](../src/features/delete-user/README.md)                               | Удаление пользователя администратором с диалогом подтверждения.                    |
| [features/edit-privacy](../src/features/edit-privacy/README.md)                             | Настройка, кто видит аватар, телефон и время последнего визита.                    |
| [features/edit-profile](../src/features/edit-profile/README.md)                             | Редактирование личных данных профиля (имя, фамилия, пол, дата рождения) в модалке. |
| [features/edit-user-privileges](../src/features/edit-user-privileges/README.md)             | Назначение пользователю ролей и прямых прав администратором.                       |
| [features/forgot-password](../src/features/forgot-password/README.md)                       | Запрос ссылки для сброса пароля по email или телефону.                             |
| [features/manage-passkeys](../src/features/manage-passkeys/README.md)                       | Список passkeys пользователя, добавление нового и удаление.                        |
| [features/manage-roles](../src/features/manage-roles/README.md)                             | Создание ролей, сохранение их прав и удаление — действия админки ролей.            |
| [features/manage-sessions](../src/features/manage-sessions/README.md)                       | Список активных сессий и их завершение — по одной, всех остальных или выход везде. |
| [features/manage-two-factor](../src/features/manage-two-factor/README.md)                   | Включение и отключение двухфакторной защиты (второй пароль при входе).             |
| [features/request-email-verification](../src/features/request-email-verification/README.md) | Повторная отправка письма для подтверждения email.                                 |
| [features/reset-password](../src/features/reset-password/README.md)                         | Установка нового пароля по токену из письма сброса.                                |
| [features/revoke-api-key](../src/features/revoke-api-key/README.md)                         | Отзыв API-ключа с диалогом подтверждения.                                          |
| [features/set-username](../src/features/set-username/README.md)                             | Установка и смена имени пользователя (@username).                                  |
| [features/sign-in](../src/features/sign-in/README.md)                                       | Вход по логину и паролю, подтверждение второго фактора и вход по passkey.          |
| [features/sign-out](../src/features/sign-out/README.md)                                     | Кнопка выхода из аккаунта.                                                         |
| [features/sign-up](../src/features/sign-up/README.md)                                       | Регистрация нового аккаунта по email или телефону.                                 |
| [features/toggle-theme](../src/features/toggle-theme/README.md)                             | Переключение светлой и тёмной темы.                                                |
| [features/upload-file](../src/features/upload-file/README.md)                               | Загрузка файлов через API или напрямую в хранилище с прогрессом.                   |

## entities

| Модуль                                                      | О чём                                                                                                                                     |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| [entities/audit](../src/entities/audit/README.md)           | Журнал аудита — курсорная лента событий, подписи типов и таблица событий.                                                                 |
| [entities/auth](../src/entities/auth/README.md)             | Аутентификация — статус входа, вход/регистрация/2FA/восстановление/выход, guard текущей сессии, общие валидации логина и пароля.          |
| [entities/permission](../src/entities/permission/README.md) | Каталог прав с сервера и матрица прав «Нет / Свои / Все» с шаблонами групп для редакторов ролей и прав пользователей.                     |
| [entities/user](../src/entities/user/README.md)             | Текущий пользователь — профиль, роли, права (can/scope/canOn/accessKey), приватность, сессии устройств, реалтайм-события, PermissionGate. |

## shared

| Модуль                                                                | О чём                                                                                                                                    |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| [shared/api](../src/shared/api/README.md)                             | Клиенты конкретных бэкендов (main — orval-генерация, dummyjson — рукописный) и их одинаковая DI-регистрация; сгенерированный код в gen/. |
| [shared/config](../src/shared/config/README.md)                       | Конфигурация окружения — адреса API и Socket.IO, имя приложения и данные сборки из import.meta.env и define Vite.                        |
| [shared/lib/access](../src/shared/lib/access/README.md)               | Грамматика прав — сопоставление с wildcard, область «все / свои», фейк доступа для тестов.                                               |
| [shared/lib/app-state](../src/shared/lib/app-state/README.md)         | DI-абстракция активности приложения (вкладка видима/скрыта) с веб-реализацией на visibilitychange.                                       |
| [shared/lib/contracts](../src/shared/lib/contracts/README.md)         | Узкие DI-контракты для развязки слайсов одного слоя; сейчас — контракт текущей auth-сессии.                                              |
| [shared/lib/di](../src/shared/lib/di/README.md)                       | Inversify-контейнер с явной регистрацией модулей, токены createInjectDecorator с useInstance/getInstance, disposer.                      |
| [shared/lib/holders](../src/shared/lib/holders/README.md)             | Асинхронное состояние поверх MobX в стиле TanStack Query — холдеры сущности, списков, пагинации, мутаций, опроса и их хуки.              |
| [shared/lib/hooks](../src/shared/lib/hooks/README.md)                 | Общие React-хуки без бизнес-логики — refs, controlled-состояние, буфер обмена, бесконечная прокрутка, горизонтальный скролл.             |
| [shared/lib/hotkeys](../src/shared/lib/hotkeys/README.md)             | Горячие клавиши — разбор сочетаний вида mod+shift+p, сопоставление с событием, хук для документа/элемента и подпись для UI.              |
| [shared/lib/http](../src/shared/lib/http/README.md)                   | HTTP-движок без знания эндпоинтов — клиент, пайплайн middleware, нормализованные ошибки, отмена, тестовый транспорт.                     |
| [shared/lib/media](../src/shared/lib/media/README.md)                 | DI-абстракция доступа к медиаустройствам (getUserMedia, остановка потока).                                                               |
| [shared/lib/models](../src/shared/lib/models/README.md)               | Базовые классы моделей над DTO — DataModelBase, createEnumModelBase, DateModel.                                                          |
| [shared/lib/navigation](../src/shared/lib/navigation/README.md)       | Подтверждение ухода со страницы с несохранёнными изменениями — переходы TanStack Router и закрытие вкладки.                              |
| [shared/lib/network](../src/shared/lib/network/README.md)             | DI-абстракция состояния сетевого подключения (online/offline) с веб-реализацией.                                                         |
| [shared/lib/notifications](../src/shared/lib/notifications/README.md) | Тосты — DI-сервис уведомлений на react-hot-toast с отрисовкой через Alert из shared/ui.                                                  |
| [shared/lib/session](../src/shared/lib/session/README.md)             | Механика токенов — TokenSession с проактивным обновлением, дедупликацией, Web Lock и синхронизацией вкладок; не знает HTTP и бэкенд.     |
| [shared/lib/slots](../src/shared/lib/slots/README.md)                 | Schema-driven compound components — слоты с метаданными владельца, разбор children за один проход.                                       |
| [shared/lib/socket](../src/shared/lib/socket/README.md)               | Socket.IO-транспорт с переподключением и авторизацией через контракт провайдера токена, комнаты со счётчиком подписок, React-хуки.       |
| [shared/lib/storage](../src/shared/lib/storage/README.md)             | DI-обёртка над localStorage, которая никогда не бросает исключений.                                                                      |
| [shared/lib/theme](../src/shared/lib/theme/README.md)                 | Светлая/тёмная тема — MobX-стор с сохранением выбора, системная схема и веб-адаптер, ставящий класс dark.                                |
| [shared/lib/utils](../src/shared/lib/utils/README.md)                 | Чистые утилиты без React и DI — классы Tailwind, форматирование дат/размеров/длительностей, плюрализация, type guards, служебные типы.   |
| [shared/lib/validation](../src/shared/lib/validation/README.md)       | Хелперы Zod для форм — русская локаль сообщений, необязательное число, типизированный refine, boolean-discriminated union.               |
| [shared/lib/webrtc](../src/shared/lib/webrtc/README.md)               | DI-абстракция WebRTC-примитивов — peer connection, SDP offer/answer, ICE-кандидаты.                                                      |
| [shared/ui](../src/shared/ui/README.md)                               | UI-кит на Radix UI + cva + tailwind-merge — инвентарь компонентов, foundation, правила и gotcha кита.                                    |
