import { createLazyFileRoute } from "@tanstack/react-router";

import { ForgotPassword } from "../../auth/pages";

export const Route = createLazyFileRoute("/_auth/forgot-password")({
  component: ForgotPassword,
});
