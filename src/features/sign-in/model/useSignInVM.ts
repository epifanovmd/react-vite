import { IAuthStore } from "@entities/auth";
import { useZodForm } from "@shared/ui";
import { useCallback, useState } from "react";

import { signInFormValidationSchema, TSignInForm } from "./validation";

export const useSignInVM = (onSuccess: () => void) => {
  const authStore = IAuthStore.useInstance();
  const [twoFactorPassword, setTwoFactorPassword] = useState("");

  const form = useZodForm(signInFormValidationSchema, {
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const handleLogin = useCallback(
    async (data: TSignInForm) => {
      await authStore.signIn(data);

      if (authStore.isAuthenticated) {
        onSuccess();
      }
    },
    [onSuccess, authStore],
  );

  /** Подтверждает второй фактор отдельным паролем; при успехе — `onSuccess`. */
  const verifyTwoFactor = useCallback(async () => {
    await authStore.verify2FA(twoFactorPassword);

    if (authStore.isAuthenticated) {
      onSuccess();
    }
  }, [onSuccess, authStore, twoFactorPassword]);

  return {
    form,
    handleLogin,
    twoFactorPassword,
    setTwoFactorPassword,
    verifyTwoFactor,
  };
};
