import { IAuthStore } from "@store";
import { createRootRoute, Outlet } from "@tanstack/react-router";

import { ErrorPage, NotFoundPage } from "../pages/errors";

export const Route = createRootRoute({
  beforeLoad: async () => {
    const auth = IAuthStore.getInstance();

    if (auth.isIdle) {
      await auth.restore();
    }
  },
  component: () => <Outlet />,
  notFoundComponent: NotFoundPage,
  errorComponent: ErrorPage,
});
