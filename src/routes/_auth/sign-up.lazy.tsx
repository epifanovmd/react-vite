import { createLazyFileRoute } from "@tanstack/react-router";

import { SignUp } from "../../domains/auth/pages";

export const Route = createLazyFileRoute("/_auth/sign-up")({
  component: SignUp,
});
