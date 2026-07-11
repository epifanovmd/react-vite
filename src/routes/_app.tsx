import { IAuthStore } from "@auth/store";
import { AppLayout } from "@components/layouts";
import { ErrorBoundary } from "@components/ui";
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
