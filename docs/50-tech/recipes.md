---
id: tech/recipes
title: Рецепты модулей
summary: Эталонный код — entity-стор (MobX + DI + холдер), feature с VM-хуком и формой, page, widget, действия над записью списка.
layer: project
roles: [developer]
stages: [implementation]
depends_on: [architecture/placement, architecture/state, architecture/di]
---

# Рецепты модулей

Эталоны в коде: стор — `entities/user`, feature — `features/sign-in`, page —
`pages/profile`, widget — `widgets/app-layout`. Новый модуль — по рецепту и с
README по [шаблону](../00-meta/templates/module-readme.md).

## Entity-стор (MobX + DI + холдер)

```ts
// entities/<name>/model/types.ts
export const IFeatureStore =
  createInjectDecorator<IFeatureStore>("IFeatureStore");

export interface IFeatureStore {
  readonly data: FeatureDto | null;
  readonly isLoading: boolean;
  load(): Promise<void>;
}

// entities/<name>/model/store.ts
@injectable()
class FeatureStore implements IFeatureStore {
  private _holder = new EntityHolder<FeatureDto>({
    onFetch: () => this._api.getFeature(),
  });

  constructor(@IMainApi() private _api: IMainApi) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get data() {
    return this._holder.data;
  }

  get isLoading() {
    return this._holder.isLoading;
  }

  load() {
    return this._holder.isFilled ? this._holder.refresh() : this._holder.load();
  }
}
export { FeatureStore };

// entities/<name>/<name>.module.ts — затем зарегистрировать в src/app/app.module.ts
export const featureModule = new ContainerModule(({ bind }) => {
  bind(IFeatureStore.Tid).to(FeatureStore).inSingletonScope();
});

// entities/<name>/index.ts
export { IFeatureStore } from "./model/types";
```

В компоненте — `IFeatureStore.useInstance()`, без обёрточного хука.

## Feature: VM-хук, валидация, форма

```ts
// features/<name>/model/validation.ts — общие правила берутся из сущности
export const signInFormValidationSchema = z.object({
  login: loginValidation,
  password: passwordValidation,
});
export type TSignInForm = z.infer<typeof signInFormValidationSchema>;

// features/<name>/model/useSignInVM.ts
export const useSignInVM = (onSuccess: () => void) => {
  const authStore = IAuthStore.useInstance();
  const form = useZodForm(signInFormValidationSchema, {
    defaultValues: { login: "", password: "" },
  });

  const handleLogin = useCallback(
    async (data: TSignInForm) => {
      await authStore.signIn(data);

      if (authStore.isAuthenticated) {
        onSuccess();
      }
    },
    [onSuccess, authStore],
  );

  return { form, handleLogin };
};
```

- VM-хук — единственный смысловой экспорт файла, имя файла = имя хука.
- Форма — `useZodForm` из `@shared/ui` (обёртка над React Hook Form + `zodResolver`).
- Feature не навигирует: результат — колбэк `onSuccess`, переход делает page.

## Page

`model/use<Name>VM.ts` композирует сторы и локальный UI-state; `ui/<Name>Page.tsx` и
подкомпоненты, у крупных — `<component>.types.ts` рядом. Данные — через
`entities`/`features`. Регистрация — файл маршрута в `src/app/routes/` ссылается на
компонент страницы ([app](../../src/app/README.md)).

## Widget

`model/use<Name>VM.ts` компонует сторы с UI-состоянием, `model/constants.ts` —
статичные данные, `ui/` — корневой компонент и части. Public API — только корневой
компонент.

## Действия над записью списка

- Сценарий «подтвердить → запрос → тост/ошибка» — в feature: хук принимает колбэк
  результата (`onDeleted`/`onSaved`/…, промис дожидается) и возвращает действие
  `(item) => Promise<boolean>`. VM страницы только обновляет список. DI не нужен.
- Колонки таблиц: `useLatestRef(vm)` + `createColumns({ vm: vmRef, ...флаги })`,
  `useMemo` по `vmRef` и примитивным флагам прав — без `eslint-disable`.
