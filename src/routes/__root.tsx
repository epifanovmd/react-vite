import { IAuthStore } from "@auth/store";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { memo } from "react";

import { ErrorPage, NotFoundPage } from "../pages/errors";

export const Route = createRootRoute({
  beforeLoad: async () => {
    // Принудительно загружаем чанк с AuthStore, чтобы DI-декоратор зарегистрировал класс
    await import("@auth/store/Auth.store");

    const auth = IAuthStore.getInstance();

    if (auth.isIdle) {
      await auth.restore();
    }
  },
  component: memo(() => <Outlet />),
  notFoundComponent: NotFoundPage,
  errorComponent: ErrorPage,
});
