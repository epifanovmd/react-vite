import { IAuthStore } from "@auth/store";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { memo } from "react";

import { ErrorPage, NotFoundPage } from "../pages/errors";

export const Route = createRootRoute({
  beforeLoad: async () => {
    const auth = IAuthStore.getInstance();

    if (auth.isIdle) {
      await auth.restore();
    }
  },
  component: memo(() => <Outlet />),
  notFoundComponent: NotFoundPage,
  errorComponent: ErrorPage,
});
