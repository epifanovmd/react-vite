import { IAuthStore } from "@entities/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

import { signInFormValidationSchema, TSignInForm } from "./validation";

export const useSignInVM = (onSuccess: () => void) => {
  const authStore = IAuthStore.useInstance();

  const form = useForm<TSignInForm>({
    defaultValues: {
      login: "epifanovmd@gmail.com",
      password: "Epifan123",
    },
    resolver: zodResolver(signInFormValidationSchema),
  });

  const handleLogin = useCallback(async () => {
    return form.handleSubmit(async data => {
      await authStore.signIn(data);

      if (authStore.isAuthenticated) {
        onSuccess();
      }
    })();
  }, [form, onSuccess, authStore]);

  return {
    form,
    handleLogin,
  };
};
