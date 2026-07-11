import { createLazyFileRoute } from "@tanstack/react-router";

import { SignUp } from "../../auth/pages";

export const Route = createLazyFileRoute("/_auth/sign-up")({
  component: SignUp,
});
