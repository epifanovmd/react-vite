import { createLazyFileRoute } from "@tanstack/react-router";

import { SignIn } from "../../auth/pages";

export const Route = createLazyFileRoute("/_auth/sign-in")({
  component: SignIn,
});
