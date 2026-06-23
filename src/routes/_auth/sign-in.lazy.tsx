import { createLazyFileRoute } from "@tanstack/react-router";

import { SignIn } from "../../pages/auth";

export const Route = createLazyFileRoute("/_auth/sign-in")({
  component: SignIn,
});
