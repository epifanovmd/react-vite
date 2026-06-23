import { createLazyFileRoute } from "@tanstack/react-router";

import { ForgotPassword } from "../../pages/auth";

export const Route = createLazyFileRoute("/_auth/forgot-password")({
  component: ForgotPassword,
});
