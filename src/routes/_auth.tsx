import { IAuthStore } from "@auth/store";
import { AuthLayout } from "@components/layouts";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { memo } from "react";

export const Route = createFileRoute("/_auth")({
  beforeLoad: () => {
    const auth = IAuthStore.getInstance();

    if (auth.isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: memo(() => (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  )),
});
