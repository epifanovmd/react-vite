import { IAuthStore } from "@entities/auth";
import { ErrorBoundary } from "@shared/ui";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppLayout } from "@widgets/app-layout";
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
