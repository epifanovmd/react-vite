import { ConfirmModalProvider, Container } from "@components";
import { disposer } from "@force-dev/utils";
import { useAppDataStore } from "@store/app";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

const Component = observer(() => {
  const { initialize } = useAppDataStore();

  useEffect(() => {
    const dispose = initialize();

    return () => {
      disposer(dispose);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <ConfirmModalProvider>
        <Outlet />
      </ConfirmModalProvider>
    </Container>
  );
});

export const Route = createRootRoute({
  component: Component,
  pendingMinMs: 0,
  pendingMs: 0,
});
