---
module: shared/lib/models
summary: Базовые классы моделей над DTO — DataModelBase, createEnumModelBase, DateModel.
---

# models

Модели оборачивают DTO и дают вычисляемые свойства для UI.

## Public API

| Экспорт               | Что                                   |
| --------------------- | ------------------------------------- |
| `DataModelBase<TDto>` | база модели: `data` — исходный DTO    |
| `createEnumModelBase` | модель перечисления с `isX`-геттерами |
| `DateModel`           | модель даты-строки (`date/`)          |

## Устройство

- `DataModelBase`: `_data` — `observable.ref`: DTO не копируется и не становится
  observable, реакция только на замену объекта целиком.
- Поля DTO — только через `model.data.x`.
- Геттеры наследника помечаются `computed` явно в `makeObservable` его конструктора.
- `createEnumModelBase` — `isX`-геттеры без `computed`: дешёвое сравнение с `data`.

## Gotcha

- По полям DTO не мутировать — изменение не увидит ни один observer; заменять объект.
