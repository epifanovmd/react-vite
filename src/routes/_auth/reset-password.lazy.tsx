import {
  createLazyFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";

import { ResetPassword } from "../../pages/reset-password";

const Component = () => {
  const navigate = useNavigate();
  const { token } = useSearch({ from: "/_auth/reset-password" });

  return (
    <ResetPassword
      token={token}
      onSuccess={() => navigate({ to: "/sign-in" })}
    />
  );
};

export const Route = createLazyFileRoute("/_auth/reset-password")({
  component: Component,
});
