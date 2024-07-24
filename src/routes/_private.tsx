import { Header } from "@components";
import { disposer } from "@force-dev/utils";
import { ISessionDataStore, useSessionDataStore } from "@store";
import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";

const App = observer(() => {
  const { initialize } = useSessionDataStore();
  const navigate = useNavigate();

  useEffect(() => {
    const dispose = initialize(() => {
      navigate({
        to: "/auth",
      });
    });

    return () => {
      disposer(dispose);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
});

export const Route = createFileRoute("/_private")({
  beforeLoad: () => {
    const { isAuthorized } = ISessionDataStore.getInstance();

    if (!isAuthorized) {
      throw redirect({ to: "/auth" });
    }
  },
  component: App,
});
