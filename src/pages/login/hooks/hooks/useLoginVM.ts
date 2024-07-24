import { useTextInput } from "@force-dev/react";
import { useProfileDataStore } from "@store";
import { useNavigate } from "@tanstack/react-router";
import { ChangeEvent, useCallback } from "react";

export const useLoginVM = () => {
  const profileDataStore = useProfileDataStore();
  const navigate = useNavigate();

  const username = useTextInput({ initialValue: "emilys" });
  const password = useTextInput({ initialValue: "emilyspass" });

  const handleChangeLogin = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      username.setValue(event.target.value);
    },
    [username],
  );

  const handleChangePassword = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      password.setValue(event.target.value);
    },
    [password],
  );

  const handleLogin = useCallback(async () => {
    if (username.value && password.value) {
      await profileDataStore.signIn({
        username: username.value,
        password: password.value,
      });

      if (profileDataStore.profile) {
        navigate({ to: "/" });
      }
    }
  }, [navigate, password.value, profileDataStore, username.value]);

  return {
    handleLogin,
    username,
    password,
    handleChangeLogin,
    handleChangePassword,
  };
};
