---
module: shared/lib/di
summary: Inversify-контейнер с явной регистрацией модулей, токены createInjectDecorator с useInstance/getInstance, disposer.
---

# di

Обвязка Inversify. Принципы — [architecture/di](../../../../docs/20-architecture/di.md).

## Public API

| Экспорт                                  | Что                                                                                 |
| ---------------------------------------- | ----------------------------------------------------------------------------------- |
| `createInjectDecorator`                  | токен-декоратор: `.Tid`, `.useInstance()`, `.getInstance()`, `@IX()` в конструкторе |
| `iocContainer`                           | `container.ts` — контейнер приложения                                               |
| `disposer`, `Disposer`, `createDisposer` | `disposer.ts` — сбор и освобождение функций очистки                                 |
| типы                                     | `types.ts`                                                                          |

## Использование

```ts
export const IMyService = createInjectDecorator<IMyService>("IMyService");

@injectable()
class MyService implements IMyService {
  constructor(@IOther() private other: IOther) {}
}

// <slice>.module.ts
export const myModule = new ContainerModule(({ bind }) => {
  bind(IMyService.Tid).to(MyService).inSingletonScope();
});

IMyService.useInstance(); // в React
IMyService.getInstance(); // вне React: guard, сервис, инициализация
```

Все `<slice>.module.ts` подключаются в `src/app/app.module.ts`
(`registerContainerModules`). Регистрация только явная — без auto-bind декораторов.

## Gotcha

- Обёрточные хуки (`useAuthStore` и т. п.) не создаются.
- В тестах контейнер собирается из нужных модулей с заглушками зависимостей
  (пример — `shared/api/__tests__/api-module-wiring.test.ts`).
