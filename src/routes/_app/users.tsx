import { createFileRoute, Outlet } from "@tanstack/react-router";
import { memo } from "react";

export const Route = createFileRoute("/_app/users")({
  component: memo(() => <Outlet />),
});
