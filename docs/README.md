<!-- Ведётся вручную: правило — docs/00-meta/authoring.md#индекс. -->

# Документация проекта

Единая система знаний: как она устроена — [meta/doc-system](00-meta/doc-system.md),
как добавить документ — [meta/authoring](00-meta/authoring.md). Документы модулей —
[modules.md](modules.md). Номер папки — приоритет при конфликте.

## Документы

### 00-meta

| Документ                                 | О чём                                                                                                               | Слой | Роли | Этапы |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ---- | ---- | ----- |
| [meta/authoring](00-meta/authoring.md)   | Куда класть новое знание, формат frontmatter, размеры, ссылки и индекс документов.                                  | core | all  | docs  |
| [meta/doc-system](00-meta/doc-system.md) | Уровни L0–L5, что где лежит и когда попадает в контекст агента.                                                     | core | all  | any   |
| [meta/priority](00-meta/priority.md)     | Порядок старшинства источников правил, слои core/stack/project, что делать при противоречии.                        | core | all  | any   |
| [meta/protection](00-meta/protection.md) | Правила и документация меняются только по явному указанию пользователя; новое правило агент предлагает через inbox. | core | all  | any   |

### 10-process

| Документ                                           | О чём                                                                                                              | Слой | Роли                        | Этапы                                            |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---- | --------------------------- | ------------------------------------------------ |
| [process/bugfix](10-process/bugfix.md)             | Багфикс через тест — воспроизвести падающим тестом, найти причину, исправить, тест остаётся.                       | core | developer, tester           | analysis, planning, implementation, verification |
| [process/git](10-process/git.md)                   | Ветки на задачу, Conventional Commits на русском, что запрещено без команды пользователя.                          | core | all                         | commit                                           |
| [process/review](10-process/review.md)             | Чек-лист ревью diff по архитектуре, конвенциям, тестам и документации; когда звать субагента reviewer.             | core | reviewer, developer         | review                                           |
| [process/roles](10-process/roles.md)               | Роли в разработке, их документы и субагенты — архитектор, разработчик, тестировщик, ревьюер, devops, документатор. | core | all                         | any                                              |
| [process/verification](10-process/verification.md) | Быстрые проверки после итерации, полная проверка перед сдачей, критерии готовности задачи.                         | core | developer, tester, reviewer | implementation, verification                     |
| [process/workflow](10-process/workflow.md)         | Обязательный цикл любой задачи — приём, анализ, план (gate), итерации, проверка, ревью, документация, коммит.      | core | all                         | any                                              |

### 20-architecture

| Документ                                                                                             | О чём                                                                                                                              | Слой  | Роли                           | Этапы                                      |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----- | ------------------------------ | ------------------------------------------ |
| [architecture/access](20-architecture/access.md)                                                     | Права-строки с иерархией и областью «все / свои», единая точка проверки в UI, права по строке, сервер — источник истины.           | stack | developer, architect           | planning, implementation                   |
| [architecture/adr/0001-knowledge-system](20-architecture/adr/0001-knowledge-system.md)               | Документация, правила и процедуры — в одной системе уровней L0–L5 с ленивой загрузкой, защитой и inbox.                            | core  | architect                      | analysis                                   |
| [architecture/adr/0002-docs-protection-by-rule](20-architecture/adr/0002-docs-protection-by-rule.md) | Хук, блокировавший запись в защищённые документы, удалён; правила и документы меняются только по явному указанию пользователя.     | core  | architect                      | analysis                                   |
| [architecture/adr/README](20-architecture/adr/README.md)                                             | Журнал архитектурных решений — зачем, когда писать ADR, список решений.                                                            | core  | architect                      | analysis, planning                         |
| [architecture/automated-checks](20-architecture/automated-checks.md)                                 | Какие архитектурные правила проверяются машиной и как оформляется узкое исключение из правила.                                     | stack | architect, reviewer, devops    | verification, review                       |
| [architecture/dependencies](20-architecture/dependencies.md)                                         | Импорты только вниз, слайсы одного слоя изолированы, self-import запрещён, общее — вниз или через контракт.                        | stack | all                            | analysis, planning, implementation, review |
| [architecture/di](20-architecture/di.md)                                                             | Явная сборка контейнера из модулей слайсов, токен вместе с интерфейсом, без обёрточных хуков, DI только на реальных границах.      | stack | developer, architect           | planning, implementation                   |
| [architecture/errors](20-architecture/errors.md)                                                     | Result-контракт вместо исключений, нормализованные ошибки транспорта, одна ошибка — одно уведомление, место providers уведомлений. | stack | developer, architect           | planning, implementation                   |
| [architecture/fsd-layers](20-architecture/fsd-layers.md)                                             | Шесть слоёв Feature-Sliced Design, их ответственность, слайсы и сегменты, именование сегментов.                                    | stack | all                            | analysis, planning                         |
| [architecture/http-session](20-architecture/http-session.md)                                         | Цепочка хранилище токенов → сессия → HTTP-клиент → API → сокет; обязательные свойства обновления токена и переподключения.         | stack | developer, architect           | planning, implementation                   |
| [architecture/placement](20-architecture/placement.md)                                               | Дерево решений — слой и сегмент для компонента, логики, API-вызова, provider; feature против widget; что такое page.               | stack | developer, architect           | analysis, planning                         |
| [architecture/public-api](20-architecture/public-api.md)                                             | Один index.ts на слайс, в shared — на каждый модуль; экспортируется только поддерживаемое.                                         | stack | developer, architect, reviewer | implementation, review                     |
| [architecture/state](20-architecture/state.md)                                                       | Сторы — синхронное состояние домена через DI; асинхронное состояние — только холдеры с общими гарантиями.                          | stack | developer, architect           | planning, implementation                   |

### 30-conventions

| Документ                                                         | О чём                                                                                                                                    | Слой  | Роли                        | Этапы                                |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----- | --------------------------- | ------------------------------------ |
| [conventions/checklist](30-conventions/checklist.md)             | Пункты ревью, специфичные для стека React + MobX + FSD, — дополняют общий чек-лист process/review.                                       | stack | reviewer, developer         | review                               |
| [conventions/comments](30-conventions/comments.md)               | Комментарий объясняет причину — JSDoc к контрактам, в теле только неочевидное, без истории изменений и мёртвого кода.                    | core  | developer, reviewer         | implementation, review               |
| [conventions/components](30-conventions/components.md)           | Один компонент на файл, helper-компоненты рядом, memo по измеримой причине, displayName у forwardRef.                                    | stack | developer, reviewer         | implementation, review               |
| [conventions/errors](30-conventions/errors.md)                   | Ошибки не глотаются, сообщение отделено от технической ошибки, обработка на одном уровне, result-контракт не смешивается с исключениями. | stack | developer, reviewer         | implementation, review               |
| [conventions/exports-imports](30-conventions/exports-imports.md) | Оформление index.ts, aliases снаружи и относительные пути внутри, import type, сортировка, без циклов через barrel.                      | stack | developer, reviewer         | implementation, review               |
| [conventions/forms](30-conventions/forms.md)                     | Декларативные формы — схема валидации отдельно, общие валидации домена в сущности, сообщения в UI-слое.                                  | stack | developer, reviewer         | implementation, review               |
| [conventions/functions](30-conventions/functions.md)             | Только стрелочные функции, хелпер выше использования, дженерик <T,> в tsx, одна операция на функцию, options вместо boolean-флагов.      | stack | developer, reviewer         | implementation, review               |
| [conventions/hooks](30-conventions/hooks.md)                     | Правила хуков, честные dependency arrays без механических правок, latest-ref для свежих значений, без новых suppressions.                | stack | developer, reviewer         | implementation, review               |
| [conventions/lint](30-conventions/lint.md)                       | Область действия правил, что не редактируется вручную, правила отключения линтера, autofix и форматирование.                             | stack | developer, reviewer         | implementation, review               |
| [conventions/naming](30-conventions/naming.md)                   | kebab-case директорий, таблица имён файлов (компоненты, хуки, store, validation, module, contract), запрещённые сегменты.                | stack | developer, reviewer         | implementation, review               |
| [conventions/state-effects](30-conventions/state-effects.md)     | Владелец lifecycle у каждого эффекта, очистка подписок, отмена устаревших запросов, навигация вне features, права в UI.                  | stack | developer, reviewer         | implementation, review               |
| [conventions/styles](30-conventions/styles.md)                   | Только design tokens и UI-кит, глобальные стили лишь в app, inline style только для динамики, статика не пересоздаётся в render.         | stack | developer, reviewer         | implementation, review               |
| [conventions/tests](30-conventions/tests.md)                     | Тесты поведения рядом с кодом в **tests**, регрессионный тест на баг, без зависимости от порядка, зоны с порогом покрытия, фейк доступа. | stack | developer, tester, reviewer | implementation, verification, review |
| [conventions/typescript](30-conventions/typescript.md)           | Без any и небезопасных assertion, типы рядом с владельцем, без shared/types, DTO у API, явный export type.                               | stack | developer, reviewer         | implementation, review               |

### 40-principles

| Документ                                                     | О чём                                                                                                                              | Слой | Роли                           | Этапы                            |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- | ---- | ------------------------------ | -------------------------------- |
| [principles/clean-code](40-principles/clean-code.md)         | Приоритеты хорошего кода, порядок работы, KISS, YAGNI, DRY по знанию, сигналы к рефакторингу.                                      | core | developer, reviewer, architect | planning, implementation, review |
| [principles/solid-patterns](40-principles/solid-patterns.md) | Паттерн только под сформулированную проблему; SOLID без избыточной архитектуры; композиция вместо наследования; таблица паттернов. | core | architect, developer, reviewer | planning, implementation, review |

### 50-tech

| Документ                           | О чём                                                                                                                     | Слой    | Роли              | Этапы                        |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------- | ----------------- | ---------------------------- |
| [tech/aliases](50-tech/aliases.md) | Шесть алиасов слоёв FSD, где объявлены, частые публичные пути shared-модулей.                                             | project | developer         | implementation               |
| [tech/gotchas](50-tech/gotchas.md) | Неочевидное поведение, не привязанное к одному модулю — линтер, dev-сервер, загрузка чанков после деплоя.                 | project | developer         | implementation, verification |
| [tech/recipes](50-tech/recipes.md) | Эталонный код — entity-стор (MobX + DI + холдер), feature с VM-хуком и формой, page, widget, действия над записью списка. | project | developer         | implementation               |
| [tech/testing](50-tech/testing.md) | Vitest + Testing Library на jsdom, где лежат тесты, порог покрытия 100% на холдеры, фейки транспорта и доступа, gotcha.   | project | developer, tester | implementation, verification |

### 60-domain

| Документ                                 | О чём                                                                                                     | Слой    | Роли                 | Этапы                              |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------- | -------------------- | ---------------------------------- |
| [domain/access](60-domain/access.md)     | Набор прав администрирования, каталог с сервера, гейты экранов, поведение при отзыве прав и смене сессии. | project | developer, architect | analysis, planning, implementation |
| [domain/glossary](60-domain/glossary.md) | Термины предметной области и проекта — сессия, 2FA, passkey, право, область, роль, комната, холдер, VM.   | project | all                  | any                                |
| [domain/overview](60-domain/overview.md) | Что за приложение, для кого, какие разделы, с каким бэкендом работает и на каком стеке написано.          | project | all                  | intake, analysis                   |
| [domain/realtime](60-domain/realtime.md) | Комнаты Socket.IO экранов администрирования, их права, события и реакция VM; личные события пользователя. | project | developer            | implementation                     |
| [domain/screens](60-domain/screens.md)   | Маршрут → page → используемые слайсы, периметры _app/_auth, навигация шапки, gotcha экранов.              | project | developer, architect | analysis, planning                 |

### 70-ops

| Документ                                   | О чём                                                                                                                  | Слой    | Роли              | Этапы                        |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- | ------- | ----------------- | ---------------------------- |
| [ops/build-docker](70-ops/build-docker.md) | Стадии Dockerfile, nginx и заголовки безопасности, docker-compose, режим сборки BUILD_MODE, цели make local-*.         | project | devops            | implementation, verification |
| [ops/ci-deploy](70-ops/ci-deploy.md)       | Workflow CI (verify на push/PR в main) и Deploy (SSH-деплой с хоста), переменные и секреты GitHub, ручной деплой make. | project | devops            | verification, commit         |
| [ops/commands](70-ops/commands.md)         | yarn и make — разработка, проверки, генерация, документация, Docker и деплой.                                          | project | all               | implementation, verification |
| [ops/environment](70-ops/environment.md)   | Требования, порты, env-файлы, как vite читает env, dev-прокси API и сокета, версия сборки.                             | project | developer, devops | implementation               |
| [ops/git-hooks](70-ops/git-hooks.md)       | lefthook — pre-commit (eslint и prettier по изменённым файлам), pre-push (типы и тесты).                               | project | devops, developer | commit                       |
| [ops/live-testing](70-ops/live-testing.md) | Одноразовый стенд — свой API, своя база, свой vite, headless Chrome по CDP; что запрещено.                             | project | tester, developer | verification                 |

### inbox

| Документ                        | О чём                                                                                         | Слой | Роли | Этапы |
| ------------------------------- | --------------------------------------------------------------------------------------------- | ---- | ---- | ----- |
| [inbox/README](inbox/README.md) | Очередь предложений новых правил и правок защищённых документов, ждущих решения пользователя. | core | all  | docs  |

Открытые предложения правил — файлы [inbox/](inbox/README.md), кроме README.
