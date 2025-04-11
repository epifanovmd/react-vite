import { usePasskeyAuth } from "@common";
import { useProfileDataStore, useSessionDataStore } from "@store";
import { useNavigate } from "@tanstack/react-router";
import { FC, memo, useCallback } from "react";

import { AsyncButton, Button } from "../ui";

export const Header: FC = memo(() => {
  const navigate = useNavigate();
  const sessionDataStore = useSessionDataStore();
  const { profile } = useProfileDataStore();
  const { handleRegister, support } = usePasskeyAuth();

  const onLogout = useCallback(() => {
    sessionDataStore.clear();
    navigate({ to: "/auth/signIn" }).then();
  }, [navigate, sessionDataStore]);

  return (
    <div
      className={
        "flex shadow-md rounded-md p-4 flex-grow mb-4 mt-4 justify-between bg-white"
      }
    >
      <div>{"Wireguard"}</div>
      <div className={"flex gap-2"}>
        {support && profile && (
          <AsyncButton
            type={"primary"}
            onClick={async () => {
              await handleRegister(profile.id);
            }}
            className={"mr-2"}
          >
            {"Passkey reg"}
          </AsyncButton>
        )}
        <Button onClick={onLogout}>{"Выход"}</Button>
      </div>
    </div>
  );
});
