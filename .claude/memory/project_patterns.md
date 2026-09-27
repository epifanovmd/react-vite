---
name: Code Patterns & Conventions
description: Реальные паттерны — создание entity-стора, feature (VM-хук + validation), page, widget, с актуальными alias-путями
type: project
---

## Создание Entity Store (MobX + DI + Holder)

```ts
// entities/<name>/model/types.ts
import { createInjectDecorator } from "@shared/lib/di";
import { EntityHolder } from "@shared/lib/holders";

export const IFeatureStore = createInjectDecorator<IFeatureStore>();

export interface IFeatureStore {
  readonly data: FeatureDto | null;
  readonly isLoading: boolean;
  load(): Promise<void>;
}

// entities/<name>/model/store.ts
import { IMainApi } from "@shared/api";
import { EntityHolder } from "@shared/lib/holders";
import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

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

// entities/<name>/<name>.module.ts
export const featureModule = new ContainerModule(({ bind }) => {
  bind(IFeatureStore.Tid).to(FeatureStore).inSingletonScope();
});
// зарегистрировать featureModule в src/app/app.module.ts

// entities/<name>/index.ts — Public API
export { IFeatureStore } from "./model/types";
```

Использование в компоненте: `const store = IFeatureStore.useInstance();` — без обёрточного хука.

## Создание Feature (VM-хук + validation + форма)

`features/sign-in/` — эталон: `model/useSignInVM.ts`, `model/validation.ts`, `ui/SignInForm.tsx`.

```ts
// features/<name>/model/validation.ts
import { loginValidation, passwordValidation } from "@entities/auth"; // общая валидация — из entities, не дублируется
import { z } from "zod";

export const signInFormValidationSchema = z.object({
  login: loginValidation,
  password: passwordValidation,
});
export type TSignInForm = z.infer<typeof signInFormValidationSchema>;

// features/<name>/model/useSignInVM.ts
import { IAuthStore } from "@entities/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

export const useSignInVM = () => {
  const authStore = IAuthStore.useInstance();
  const navigate = useNavigate();
  const form = useForm<TSignInForm>({
    resolver: zodResolver(signInFormValidationSchema),
  });

  const handleLogin = useCallback(
    () =>
      form.handleSubmit(async data => {
        await authStore.signIn(data);
        if (authStore.isAuthenticated) navigate({ to: "/" });
      })(),
    [form, navigate, authStore],
  );

  return { form, handleLogin };
};
```

VM-хук — единственный смысловой экспорт файла → имя файла = имя хука (`useSignInVM.ts`, camelCase). Файл-утилита среди других — `use-kebab-case.ts` (например `use-holder-ref.ts` в `shared/lib/holders/hooks/`).

## Создание Page

`pages/profile/` — эталон: `model/useProfileVM.ts` (композирует `IUserStore` + локальный UI-state типа `isEditOpen`), `ui/ProfilePage.tsx` + разбитые под-компоненты (`ProfileCard`, `ProfileDetails`, `ProfileIdentity`, `ProfileMeta`), каждый со своим `<component-kebab>.types.ts` рядом (`profile-card.types.ts`).

```ts
// pages/<name>/model/use<Name>VM.ts
export const useProfileVM = () => {
  const userStore = IUserStore.useInstance();
  useEffect(() => {
    userStore.load().then();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { model: userStore.profile /* ... */ };
};
```

Page — тонкая композиция: делегирует данные в `entities`/`features`, сама почти не содержит бизнес-логики. Регистрируется в `src/app/routes/` (файл роута импортирует страницу и рендерит её в `component`).

## Создание Widget

`widgets/app-layout/` — эталон: `model/useHeaderVM.ts` компонует `IUserStore` (текущий юзер) с чисто UI-состоянием (`mobileOpen`), `model/constants.ts` — статичные данные (`NAV_GROUPS`). `ui/` — `AppLayout.tsx` (корневой компонент) + разбитые части (`Header`, `HeaderNavItem`, `MobileMenu`, `ProfileMenu`). Public API — только `AppLayout` в `index.ts`.

## Правила (сводка)

- **`src/shared/api/gen/`** — auto-generated, никогда не редактировать. `yarn generate:orval`.
- **`src/app/routeTree.gen.ts`** — auto-generated, никогда не редактировать.
- **Path aliases** обязательны снаружи слайса: `@app`, `@pages`, `@widgets`, `@features`, `@entities`, `@shared`. Внутри слайса — только относительные пути (см. `project_aliases.md`).
- **Stores** — singleton через DI, биндятся в `<slice>.module.ts`, регистрируются в `app/app.module.ts`.
- **Formы** — React Hook Form + Zod (`zodResolver`).
- **Layer boundaries**: слайсы одного слоя не импортируют друг друга — общая логика выносится слоем ниже (пример: `loginValidation`/`passwordValidation` в `entities/auth`, используются `features/sign-in` и `features/sign-up`) либо оформляется как Dependency Inversion контракт в `shared` (пример: `ITokenProvider` в `shared/lib/socket/contract`, реализация в `entities/auth`).
- **Async state** — через холдеры (`shared/lib/holders`), не через ручной `useState`/`useEffect` fetch (см. `project_holders.md`).
