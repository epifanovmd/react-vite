import { usePasskeyAuth } from "@common";
import { useSessionDataStore, useUserDataStore } from "@store";
import { FC, memo } from "react";

import { AsyncButton, Button } from "../ui";

export const Header: FC = memo(() => {
  const sessionDataStore = useSessionDataStore();
  const { user } = useUserDataStore();
  const { userId, handleRegister, support } = usePasskeyAuth();

  return (
    <div
      className={
        "flex shadow-md rounded-md p-4 flex-grow mb-4 mt-4 justify-between bg-white"
      }
    >
      <div>{"Wireguard"}</div>
      <div className={"flex gap-2"}>
        {support && user && !userId && (
          <AsyncButton
            type={"primary"}
            onClick={async () => {
              await handleRegister(user.id);
            }}
            className={"mr-2"}
          >
            {"Passkey reg"}
          </AsyncButton>
        )}
        <Button onClick={sessionDataStore.clear}>{"Выход"}</Button>
      </div>
    </div>
  );
});
