import { ForgotPasswordPage } from "@pages/forgot-password";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/forgot-password")({
  component: ForgotPasswordPage,
});
