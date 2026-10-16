import { IAuthStore } from "@entities/auth";
import { ErrorPage, NotFoundPage } from "@pages/errors";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { memo } from "react";

export const Route = createRootRoute({
  // Запасной путь: роутер монтируется после `IAppDataStore.isRestored`, к этому
  // моменту статус уже не Idle и restore здесь не вызывается.
  beforeLoad: () => {
    const auth = IAuthStore.getInstance();

    return auth.isIdle ? auth.restore() : undefined;
  },
  component: memo(() => <Outlet />),
  notFoundComponent: NotFoundPage,
  errorComponent: ErrorPage,
});
