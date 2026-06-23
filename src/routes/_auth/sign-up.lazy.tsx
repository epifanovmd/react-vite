import { createLazyFileRoute } from "@tanstack/react-router";

import { SignUp } from "../../pages/auth";

export const Route = createLazyFileRoute("/_auth/sign-up")({
  component: SignUp,
});
