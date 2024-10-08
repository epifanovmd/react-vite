import { disposer } from "@force-dev/utils";
import { createRootRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";

import { Container } from "~@components";
import { ISessionDataStore, useSessionDataStore } from "~@store";

const Component = observer(() => {
  const { initialize } = useSessionDataStore();
  const navigate = useNavigate();

  useEffect(() => {
    const dispose = initialize(() => {
      navigate({
        to: "/auth",
      }).then();
    });

    return () => {
      disposer(dispose);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <Outlet />
    </Container>
  );
});

export const Route = createRootRoute({
  beforeLoad: async () => {
    const { isReady, restore } = ISessionDataStore.getInstance();

    if (!isReady) {
      restore().then();
    }
  },
  component: Component,
  pendingMinMs: 0,
  pendingMs: 0,
});
