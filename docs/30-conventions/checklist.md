---
id: conventions/checklist
title: Чек-лист стека для ревью
summary: Пункты ревью, специфичные для стека React + MobX + FSD, — дополняют общий чек-лист process/review.
layer: stack
roles: [reviewer, developer]
stages: [review]
depends_on: [process/review]
---

# Чек-лист стека для ревью

Дополняет общий чек-лист [process/review](../10-process/review.md).

**Архитектура** — [fsd-layers](../20-architecture/fsd-layers.md),
[dependencies](../20-architecture/dependencies.md), [state](../20-architecture/state.md)

- [ ] Код на минимально подходящем слое FSD; нет импортов вверх и между соседними
      слайсами; внутри слайса — относительные пути.
- [ ] Асинхронное состояние — через холдеры; API — `{ data } | { error }`, ошибки не
      глотаются.
- [ ] DI — токен через `useInstance`/`getInstance`, без обёрточных хуков; новый модуль
      зарегистрирован в композиционном корне.
- [ ] Сгенерированный код (клиент API, дерево маршрутов) не правлен вручную.

**React** — [components](components.md), [hooks](hooks.md),
[state-effects](state-effects.md)

- [ ] Один компонент на файл; сценарий — в VM-хуке.
- [ ] Dependency arrays не изменены механически; новых отключений `exhaustive-deps` нет.
- [ ] Права — через стор пользователя, по строке; колонки таблиц мемоизированы по
      отпечатку прав.
- [ ] Статические стили не создаются в render; используются токены и UI-кит.
