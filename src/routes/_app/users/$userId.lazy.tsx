import {
  createLazyFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";

import { UserDetail } from "../../../pages/users";

const Component = () => {
  const navigate = useNavigate();
  const { userId } = useParams({ from: "/_app/users/$userId" });

  return (
    <UserDetail userId={userId} onBack={() => navigate({ to: "/users" })} />
  );
};

export const Route = createLazyFileRoute("/_app/users/$userId")({
  component: Component,
});
