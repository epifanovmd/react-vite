import { createLazyFileRoute } from "@tanstack/react-router";

import { SignIn } from "../../domains/auth/pages";

export const Route = createLazyFileRoute("/_auth/sign-in")({
  component: SignIn,
});
