import {
  createLazyFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { memo } from "react";

import { ResetPassword } from "../../pages/reset-password";

export const Route = createLazyFileRoute("/_auth/reset-password")({
  component: memo(() => {
    const navigate = useNavigate();
    const { token } = useSearch({ from: "/_auth/reset-password" });

    return (
      <ResetPassword
        token={token}
        onSuccess={() => navigate({ to: "/sign-in" })}
      />
    );
  }),
});
