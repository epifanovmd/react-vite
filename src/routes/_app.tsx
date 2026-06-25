import { AppLayout } from "@components/layouts";
import { ErrorBoundary } from "@components/ui";
import { IAuthStore } from "@store";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { memo } from "react";

export const Route = createFileRoute("/_app")({
  beforeLoad: () => {
    const auth = IAuthStore.getInstance();

    if (!auth.isAuthenticated) {
      throw redirect({ to: "/sign-in" });
    }
  },
  component: memo(() => (
    <AppLayout>
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </AppLayout>
  )),
});
