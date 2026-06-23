import { AuthLayout } from "@components/layouts";
import { IAuthStore } from "@store";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { memo } from "react";

const Component = memo(() => (
  <AuthLayout>
    <Outlet />
  </AuthLayout>
));

export const Route = createFileRoute("/_auth")({
  beforeLoad: () => {
    const auth = IAuthStore.getInstance();

    if (auth.isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: Component,
});
